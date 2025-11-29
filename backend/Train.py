import os, json, math
import numpy as np
import tensorflow as tf
# pyright: reportMissingImports=false
# pyright: reportAttributeAccessIssue=false
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import GlobalAveragePooling2D, Dense, Dropout, BatchNormalization
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint, ReduceLROnPlateau, LearningRateScheduler
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.regularizers import l2
from sklearn.metrics import classification_report, confusion_matrix

# Optional: enable mixed precision on compatible hardware
# from tensorflow.keras import mixed_precision
# mixed_precision.set_global_policy('mixed_float16')

print("="*70)
print(" LEAF DISEASE DETECTION - TRAINING (IMPROVED) ")
print("="*70)

IMG_SIZE = 224
BATCH_SIZE = 16  # Reduced batch size for better gradient updates
TOTAL_EPOCHS = 4  # Single training phase with 4 epochs

TRAIN_DIR = os.path.join("dataset", "train")
VAL_DIR = os.path.join("dataset", "validation")

CLASS_ORDER = ["Powdery_mildew", "Leaf_Spot", "Aphids", "Healthy"]
DISPLAY_LABELS = [
    "Powdery mildew",
    "Leaf spot",
    "Aphids (Aphis sp.)",
    "Healthy",
]
NUM_CLASSES = len(CLASS_ORDER)

print(f"Config: IMG {IMG_SIZE}, BATCH {BATCH_SIZE}, classes={CLASS_ORDER}")

# --- Data augmentation (less extreme) ---
# Custom preprocessing function that combines augmentation and MobileNetV2 preprocessing
def preprocess_for_training(img):
    # Apply MobileNetV2 preprocessing
    return preprocess_input(img)

train_datagen = ImageDataGenerator(
    preprocessing_function=preprocess_for_training,
    rotation_range=25,
    width_shift_range=0.15,
    height_shift_range=0.15,
    shear_range=0.15,
    zoom_range=0.15,
    horizontal_flip=True,
    brightness_range=[0.8, 1.2],
    fill_mode="nearest"
)

# For validation, only apply MobileNetV2 preprocessing
val_datagen = ImageDataGenerator(preprocessing_function=preprocess_for_training)

train_gen = train_datagen.flow_from_directory(
    TRAIN_DIR,
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode="categorical",
    shuffle=True,
    classes=CLASS_ORDER
)
val_gen = val_datagen.flow_from_directory(
    VAL_DIR,
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode="categorical",
    shuffle=False,
    classes=CLASS_ORDER
)

print("Class indices (verify order):", train_gen.class_indices)

# --- Robust class-weight calculation from generator labels ---
counts = np.bincount(train_gen.classes, minlength=NUM_CLASSES)
total = counts.sum()
class_weights = {}
for i, c in enumerate(counts):
    if c > 0:
        class_weights[i] = total / (NUM_CLASSES * c)
    else:
        class_weights[i] = 1.0

print("Class counts:", dict(zip(CLASS_ORDER, counts)))
print("Class weights:", {CLASS_ORDER[i]: round(w, 3) for i, w in class_weights.items()})

steps_per_epoch = math.ceil(train_gen.samples / BATCH_SIZE)
validation_steps = math.ceil(val_gen.samples / BATCH_SIZE)
print(f"Train samples: {train_gen.samples}, Val samples: {val_gen.samples}")
print(f"Steps per epoch: {steps_per_epoch}, Validation steps: {validation_steps}")

# --- Build model ---
base_model = MobileNetV2(weights="imagenet", include_top=False, input_shape=(IMG_SIZE, IMG_SIZE, 3))
base_model.trainable = False

model = Sequential([
    base_model,
    GlobalAveragePooling2D(),
    BatchNormalization(),
    Dense(512, activation="relu", kernel_regularizer=l2(0.001)),
    BatchNormalization(),
    Dropout(0.5),
    Dense(256, activation="relu", kernel_regularizer=l2(0.001)),
    BatchNormalization(),
    Dropout(0.4),
    Dense(128, activation="relu", kernel_regularizer=l2(0.001)),
    BatchNormalization(),
    Dropout(0.3),
    Dense(64, activation="relu", kernel_regularizer=l2(0.001)),
    Dropout(0.2),
    # If mixed precision is enabled, cast final to float32:
    Dense(NUM_CLASSES, activation="softmax", dtype="float32")
])

optimizer = Adam(learning_rate=1e-3)
model.compile(optimizer=optimizer, loss="categorical_crossentropy", metrics=["accuracy"])
model.summary()

# --- Callbacks ---
early = EarlyStopping(monitor="val_accuracy", patience=6, restore_best_weights=True, min_delta=1e-4, verbose=1)
plateau = ReduceLROnPlateau(monitor="val_loss", factor=0.5, patience=3, min_lr=1e-7, verbose=1)
ckpt = ModelCheckpoint("plant_disease_model.h5", monitor="val_accuracy", save_best_only=True, verbose=1, mode="max")

def lr_schedule(epoch):
    if epoch < 3:
        return 1e-3
    elif epoch < 7:
        return 5e-4
    else:
        return 1e-4

lr_scheduler = LearningRateScheduler(lr_schedule, verbose=1)

# --- Training ---
history1 = model.fit(
    train_gen,
    validation_data=val_gen,
    epochs=TOTAL_EPOCHS,
    steps_per_epoch=steps_per_epoch,
    validation_steps=validation_steps,
    callbacks=[early, plateau, lr_scheduler, ckpt],
    class_weight=class_weights,
    verbose=1
)

# --- Final evaluation & diagnostics ---
# Evaluate (this uses validation_steps)
val_loss, val_accuracy = model.evaluate(val_gen, steps=validation_steps, verbose=1)
print(f"Final val acc: {val_accuracy*100:.2f}%, val loss: {val_loss:.4f}")

# --- Corrected prediction & reporting:
# Ensure generator is reset, predict, then trim predictions to exactly val_gen.samples
val_gen.reset()
preds = model.predict(val_gen, steps=validation_steps, verbose=1)

# preds may have shape (N_preds, NUM_CLASSES) where N_preds == validation_steps * batch_size.
# Trim to the exact number of validation samples so labels align perfectly:
preds = np.asarray(preds)
if preds.ndim == 1:
    # unlikely for categorical_softmax, but handle defensively
    preds = preds.reshape(-1, NUM_CLASSES)

# Trim to val_gen.samples (in case predict produced an extra padded batch)
n_val = val_gen.samples
if preds.shape[0] < n_val:
    # Defensive: if fewer predictions than samples, raise to help debugging
    raise ValueError(f"Predictions ({preds.shape[0]}) fewer than validation samples ({n_val}). Check steps/batch settings.")
preds = preds[:n_val]

# Now compute indices and compare against generator's classes (which are in order since shuffle=False)
y_pred = np.argmax(preds, axis=1)
y_true = np.asarray(val_gen.classes)  # length == val_gen.samples

if y_true.shape[0] != y_pred.shape[0]:
    # Safety check - should not happen because we trimmed preds to val_gen.samples
    raise ValueError(f"Mismatch: y_true ({y_true.shape[0]}) vs y_pred ({y_pred.shape[0]})")

# Get class indices from generator to ensure correct ordering
class_indices = train_gen.class_indices
print(f"\nGenerator class_indices: {class_indices}")

# Create reverse mapping (index -> class_name) with STRING keys for JSON compatibility
index_to_class = {str(v): k for k, v in class_indices.items()}
# Create ordered list of class names by index (ensures correct order)
ordered_classes = [index_to_class[str(i)] for i in range(len(index_to_class))]

print(f"Ordered classes (model output order): {ordered_classes}")
print(f"Index to class mapping: {index_to_class}")

print("\nClassification report:")
print(classification_report(y_true, y_pred, target_names=ordered_classes, digits=4))
print("\nConfusion matrix:")
print(confusion_matrix(y_true, y_pred))

# Save model and labels
model.save("plant_disease_model.h5")

# Create display map: maps canonical class names to display names
display_map = {cls: disp for cls, disp in zip(CLASS_ORDER, DISPLAY_LABELS)}

# CRITICAL: Ensure index_to_label uses STRING keys and maps to canonical class names
# This is what the model outputs: index -> canonical class name
index_to_label_canonical = {str(i): ordered_classes[i] for i in range(len(ordered_classes))}

print(f"\nSaving labels.json with:")
print(f"  - indices (class order): {ordered_classes}")
print(f"  - index_to_label (canonical): {index_to_label_canonical}")
print(f"  - display_map: {display_map}")

labels = {
    "indices": ordered_classes,  # Class order matching model output indices
    "index_to_label": index_to_label_canonical,  # STRING keys: "0" -> "Powdery_mildew", etc.
    "display": DISPLAY_LABELS,  # Display labels in same order as indices
    "display_map": display_map,  # Maps canonical -> display: "Powdery_mildew" -> "Powdery mildew"
    "metadata": {
        "model_type": "MobileNetV2",
        "image_size": IMG_SIZE,
        "batch_size": BATCH_SIZE,
        "training_epochs": TOTAL_EPOCHS,
        "final_accuracy": float(val_accuracy),
        "final_loss": float(val_loss),
        "class_indices_from_generator": class_indices  # For debugging
    }
}
with open("labels.json", "w", encoding="utf-8") as f:
    json.dump(labels, f, indent=2)

print("Done.")