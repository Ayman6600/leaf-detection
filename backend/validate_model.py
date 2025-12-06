import os
import json
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.applications.resnet50 import preprocess_input
from sklearn.metrics import classification_report, confusion_matrix

print("="*70)
print(" 🔍 MODEL DEBUGGING TOOL ")
print("="*70)

# ============ CONFIG ============
IMG_SIZE = 224
BATCH_SIZE = 32
DATA_DIR = os.path.join("dataset", "train")
MODEL_PATH = "plant_disease_model.h5"
LABELS_PATH = "labels.json"

# ============ LOAD RESOURCES ============
if not os.path.exists(MODEL_PATH):
    print(f"❌ Model not found: {MODEL_PATH}")
    exit(1)

if not os.path.exists(LABELS_PATH):
    print(f"❌ Labels not found: {LABELS_PATH}")
    exit(1)

print("Loading model...")
model = load_model(MODEL_PATH)
print("✓ Model loaded")

with open(LABELS_PATH, "r") as f:
    labels_data = json.load(f)
CLASS_ORDER = labels_data.get("indices", [])
print(f"✓ Classes: {CLASS_ORDER}")

# ============ DATA LOADING (PROPER VALIDATION SPLIT) ============
print("\n[1/3] Loading Validation Data (Same split as training)...")
# We use the same seed=123 to ensure we get the same validation set as during training
try:
    val_ds = tf.keras.utils.image_dataset_from_directory(
        DATA_DIR,
        validation_split=0.2,
        subset="validation",
        seed=123,
        image_size=(IMG_SIZE, IMG_SIZE),
        batch_size=BATCH_SIZE,
        label_mode='categorical',
        class_names=CLASS_ORDER,
        shuffle=False  # No shuffle for consistent evaluation
    )
except ValueError as e:
    print(f"❌ Error loading dataset: {e}")
    exit(1)

# Preprocessing function (must match training)
def preprocess_data(images, labels):
    return preprocess_input(images), labels

val_ds = val_ds.map(preprocess_data)

# ============ PREDICTIONS ============
print("\n[2/3] Running Predictions on Validation Set...")
y_true = []
y_pred = []
y_conf = []

# Iterate over the dataset
for images, labels in val_ds:
    preds = model.predict(images, verbose=0)
    
    # Get true labels (argmax of one-hot)
    batch_true = np.argmax(labels.numpy(), axis=1)
    
    # Get predicted labels
    batch_pred = np.argmax(preds, axis=1)
    
    # Get confidence of predicted class
    batch_conf = np.max(preds, axis=1)
    
    y_true.extend(batch_true)
    y_pred.extend(batch_pred)
    y_conf.extend(batch_conf)

# ============ ANALYSIS ============
print("\n[3/3] Analysis Results")
print("-" * 30)

# 1. Check for Model Collapse (Predicting only one class)
from collections import Counter
pred_counts = Counter(y_pred)
total_preds = len(y_pred)

print("\n📊 Prediction Distribution:")
for idx, count in pred_counts.items():
    class_name = CLASS_ORDER[idx]
    percentage = (count / total_preds) * 100
    print(f"  - {class_name}: {count} ({percentage:.1f}%)")

if len(pred_counts) == 1:
    print("\n⚠️ CRITICAL: Model has COLLAPSED. It predicts only ONE class for everything.")
elif len(pred_counts) < len(CLASS_ORDER):
    print("\n⚠️ WARNING: Model is ignoring some classes completely.")

# 2. Classification Report
print("\n📋 Classification Report:")
print(classification_report(y_true, y_pred, target_names=CLASS_ORDER, zero_division=0))

# 3. Confusion Matrix
print("\nConfusion Matrix:")
cm = confusion_matrix(y_true, y_pred)
print(cm)

# 4. Confidence Check
avg_conf = np.mean(y_conf)
print(f"\nAverage Confidence: {avg_conf:.4f}")
high_conf_preds = sum(1 for c in y_conf if c > 0.99)
print(f"Predictions with >99% confidence: {high_conf_preds}/{total_preds} ({high_conf_preds/total_preds*100:.1f}%)")

if high_conf_preds / total_preds > 0.9 and len(pred_counts) == 1:
    print("\n❌ DIAGNOSIS: The model is confidently wrong (Overfitting/Collapse).")
    print("   Possible causes: Extreme class imbalance, Learning rate too high, or Data leakage.")
else:
    print("\n✅ Diagnosis complete. Check the report above.")
