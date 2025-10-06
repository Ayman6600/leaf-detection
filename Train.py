import os, json
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import GlobalAveragePooling2D, Dense, Dropout
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint, ReduceLROnPlateau

# ---------------- Settings ----------------
IMG_SIZE = 224
BATCH_SIZE = 16
EPOCHS = 4

TRAIN_DIR = os.path.join("dataset", "train")
VAL_DIR = os.path.join("dataset", "validation")

# Fix the class order explicitly so indices are predictable (0..3 in this order)
CLASS_ORDER = ["Powdery_mildew", "Leaf_Spot", "Aphids", "Healthy"]

# ---------------- Data ----------------
train_datagen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=25,
    width_shift_range=0.1,
    height_shift_range=0.1,
    shear_range=0.1,
    zoom_range=0.15,
    horizontal_flip=True,
    fill_mode="nearest"
)
val_datagen = ImageDataGenerator(rescale=1./255)

train_gen = train_datagen.flow_from_directory(
    TRAIN_DIR,
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode="categorical",
    shuffle=True,
    classes=CLASS_ORDER  # enforce class indices order
)
val_gen = val_datagen.flow_from_directory(
    VAL_DIR,
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode="categorical",
    shuffle=False,
    classes=CLASS_ORDER
)

# ---------------- Model ----------------
base_model = MobileNetV2(weights="imagenet", include_top=False, input_shape=(IMG_SIZE, IMG_SIZE, 3))
base_model.trainable = False  # freeze backbone for initial training

model = Sequential([
    base_model,
    GlobalAveragePooling2D(),
    Dropout(0.35),
    Dense(128, activation="relu"),
    Dropout(0.35),
    Dense(4, activation="softmax")
])

model.compile(optimizer="adam", loss="categorical_crossentropy", metrics=["accuracy"])

early = EarlyStopping(monitor="val_loss", patience=5, restore_best_weights=True)
plateau = ReduceLROnPlateau(monitor="val_loss", factor=0.5, patience=2, verbose=1)
ckpt = ModelCheckpoint("plant_disease_model.h5", monitor="val_accuracy", save_best_only=True, verbose=1)

history = model.fit(
    train_gen,
    validation_data=val_gen,
    epochs=EPOCHS,
    callbacks=[early, plateau, ckpt]
)

print("✅ Saved best model to plant_disease_model.h5")

# Save the label order to a json file so the Flask app can read it reliably
labels = {
    "indices": CLASS_ORDER,
    "display": ["Powdery mildew", "Leaf spot", "Aphids (Aphis sp.)", "Healthy"]
}
with open("labels.json", "w", encoding="utf-8") as f:
    json.dump(labels, f, indent=2)
print("✅ Saved labels.json with class order.")
