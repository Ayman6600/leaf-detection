# improved_app.py
# pyright: reportMissingImports=false
import os
import json
import uuid
import threading
from pathlib import Path
from typing import Dict

from flask import Flask, request, jsonify, send_from_directory, current_app
from flask_cors import CORS
from werkzeug.utils import secure_filename

import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image as keras_image
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input

# ---------- Config ----------
APP_ROOT = Path(__file__).resolve().parent
UPLOAD_DIR = APP_ROOT / "static" / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

MODEL_PATH = APP_ROOT / "plant_disease_model.h5"
LABELS_PATH = APP_ROOT / "labels.json"

ALLOWED_EXT = {".jpg", ".jpeg", ".png", ".bmp"}
MAX_CONTENT_LENGTH = 6 * 1024 * 1024  # 6 MB max upload

DEBUG = False

# ---------- App ----------
app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = MAX_CONTENT_LENGTH
CORS(app, resources={r"/*": {"origins": "*"}})

# ---------- Model loading ----------
model = None
model_lock = threading.Lock()

def load_model_or_fail(path: Path):
    global model
    if not path.exists():
        raise FileNotFoundError(f"Model file not found at {path}")
    # load once at startup
    model = load_model(str(path))
    # optional: warm-up
    try:
        with model_lock:
            dummy = np.zeros((1, 224, 224, 3), dtype=np.float32)
            _ = model.predict(dummy, verbose=0)
    except Exception:
        pass

try:
    print("Loading model...", MODEL_PATH)
    load_model_or_fail(MODEL_PATH)
    print("✅ Model loaded")
except Exception as e:
    print("❌ Model loading failed:", e)
    model = None

# ---------- Labels ----------
if LABELS_PATH.exists():
    with open(LABELS_PATH, "r", encoding="utf-8") as f:
        labels_data = json.load(f)
    
    # Get class order (canonical names) - this matches model output indices
    class_order = labels_data.get("indices", ["Powdery_mildew", "Leaf_Spot", "Aphids", "Healthy"])
    
    # Get display labels (human-readable)
    display_labels = labels_data.get("display", class_order)
    
    # Get display map: canonical -> display name
    display_map = labels_data.get("display_map") or {
        cls: disp for cls, disp in zip(class_order, display_labels)
    }
    
    # Get index_to_label mapping (should have STRING keys: "0", "1", etc.)
    # This maps model output index -> canonical class name
    raw_index_to_label = labels_data.get("index_to_label") or {
        str(i): class_order[i] for i in range(len(class_order))
    }
    
    # Validate the mapping
    if len(raw_index_to_label) != len(class_order):
        raise ValueError(f"Mismatch: index_to_label has {len(raw_index_to_label)} entries but class_order has {len(class_order)}")
    
    print(f"Loaded labels: {len(class_order)} classes")
    print(f"Class order: {class_order}")
    print(f"Index to label (canonical): {raw_index_to_label}")
else:
    # Fallback if labels.json doesn't exist
    class_order = ["Powdery_mildew", "Leaf_Spot", "Aphids", "Healthy"]
    display_labels = ["Powdery mildew", "Leaf spot", "Aphids (Aphis sp.)", "Healthy"]
    display_map = {cls: disp for cls, disp in zip(class_order, display_labels)}
    raw_index_to_label = {str(i): class_order[i] for i in range(len(class_order))}
    print("⚠️ Warning: labels.json not found, using fallback values")

if len(class_order) != len(display_labels):
    print(f"⚠️ Warning: class_order ({len(class_order)}) != display_labels ({len(display_labels)}), using class_order")
    display_labels = class_order
    display_map = {cls: cls for cls in class_order}

# Build final index->display_label mapping for API responses
# Step 1: Get canonical class name from index (from raw_index_to_label)
# Step 2: Convert canonical -> display name (from display_map)
index_to_label = {}
for idx_str in [str(i) for i in range(len(class_order))]:
    canonical_name = raw_index_to_label.get(idx_str)
    if canonical_name is None:
        raise ValueError(f"Missing index {idx_str} in index_to_label mapping")
    # Convert canonical name to display name
    display_name = display_map.get(canonical_name, canonical_name)
    index_to_label[idx_str] = display_name

print(f"Final index_to_label (display): {index_to_label}")
NUM_CLASSES = len(class_order)
print(f"Number of classes: {NUM_CLASSES}")

# ---------- Helpers ----------
def allowed_file(filename: str) -> bool:
    ext = Path(filename).suffix.lower()
    return ext in ALLOWED_EXT

def get_disease_info(disease_name: str, confidence: float) -> Dict[str, str]:
    """
    Get description and recommendation for a detected disease.
    Returns dict with 'description' and 'recommendation' keys.
    """
    # Normalize disease name (handle both canonical and display names)
    disease_lower = disease_name.lower()
    
    if "healthy" in disease_lower:
        return {
            "description": "Your plant appears healthy with no signs of disease.",
            "recommendation": "Continue with proper care: water when soil is dry, provide bright indirect sunlight, maintain good air circulation, and fertilize monthly during growing season."
        }
    elif "powdery" in disease_lower or "mildew" in disease_lower:
        severity = "early" if confidence < 0.3 else "moderate" if confidence < 0.6 else "severe"
        if severity == "early":
            return {
                "description": "Powdery mildew is a fungal disease appearing as white powdery spots on leaves.",
                "recommendation": "Remove affected leaves immediately. Improve air circulation and avoid overhead watering. Apply milk spray (1:10 ratio) weekly as preventive measure."
            }
        elif severity == "moderate":
            return {
                "description": "Powdery mildew is a fungal disease appearing as white powdery spots on leaves.",
                "recommendation": "Remove and dispose of infected plant material. Apply potassium bicarbonate solution (1 tbsp + ½ tsp liquid soap per gallon) every 7-10 days. Space plants adequately for better air circulation."
            }
        else:
            return {
                "description": "Powdery mildew is a fungal disease appearing as white powdery spots on leaves.",
                "recommendation": "Remove heavily infected leaves and dispose in sealed bags. Apply sulfur-based fungicide according to manufacturer instructions. Treat surrounding plants as preventive measure. Improve growing conditions (airflow, spacing, watering practices)."
            }
    elif "spot" in disease_lower:
        severity = "early" if confidence < 0.3 else "moderate" if confidence < 0.6 else "severe"
        if severity == "early":
            return {
                "description": "Leaf spot is a bacterial or fungal disease causing spots on leaves.",
                "recommendation": "Remove spotted leaves immediately. Avoid overhead watering. Improve air circulation. Apply neem oil spray (2ml per liter) as preventive measure."
            }
        elif severity == "moderate":
            return {
                "description": "Leaf spot is a bacterial or fungal disease causing spots on leaves.",
                "recommendation": "Remove and destroy infected leaves. Apply copper-based fungicide (follow label instructions). Water at soil level, not on foliage. Increase spacing between plants for better airflow."
            }
        else:
            return {
                "description": "Leaf spot is a bacterial or fungal disease causing spots on leaves.",
                "recommendation": "Remove all severely affected leaves. Apply copper fungicide every 7-14 days. Consider crop rotation for next planting. Improve drainage and reduce humidity around plants."
            }
    elif "aphid" in disease_lower:
        severity = "early" if confidence < 0.3 else "moderate" if confidence < 0.6 else "severe"
        if severity == "early":
            return {
                "description": "Aphids are small insects that feed on plant sap, causing damage to leaves.",
                "recommendation": "Spray plants with strong water jet to dislodge aphids. Introduce beneficial insects like ladybugs. Apply neem oil spray (2ml per liter) in the evening."
            }
        elif severity == "moderate":
            return {
                "description": "Aphids are small insects that feed on plant sap, causing damage to leaves.",
                "recommendation": "Apply insecticidal soap (2 tsp per liter). Spray thoroughly, covering undersides of leaves. Check for ants and control them (they protect aphids). Repeat treatment every 3-4 days until controlled."
            }
        else:
            return {
                "description": "Aphids are small insects that feed on plant sap, causing damage to leaves.",
                "recommendation": "Use neem oil or pyrethrin-based insecticide. Apply systemic insecticide if infestation persists. Remove heavily infested plant parts. Monitor and reapply treatment as needed."
            }
    else:
        return {
            "description": f"Detected condition: {disease_name}",
            "recommendation": "Consult with a plant specialist for proper diagnosis and care recommendations. Monitor plant health closely and ensure proper growing conditions."
        }

def preprocess_image(path: str, target_size=(224, 224)):
    """
    Preprocess image for MobileNetV2 inference.
    MUST match training preprocessing exactly:
    1. Load image and resize to target_size
    2. Convert to array
    3. Apply MobileNetV2 preprocess_input (normalizes to [-1, 1])
    """
    # Load and resize image
    img = keras_image.load_img(path, target_size=target_size)
    # Convert to numpy array
    arr = keras_image.img_to_array(img).astype("float32")
    # Apply MobileNetV2 preprocessing (normalizes to [-1, 1] range)
    # This matches the training preprocessing_function
    arr = preprocess_input(arr)
    # Add batch dimension: (224, 224, 3) -> (1, 224, 224, 3)
    arr = np.expand_dims(arr, axis=0)
    return arr

# ---------- Routes ----------
@app.route("/", methods=["GET"])
def index():
    return jsonify({"message": "LEAF Disease Detection API is running", "status": "success"})

@app.route("/api/health", methods=["GET"])
def health():
    model_ready = model is not None
    return jsonify({"status": "healthy" if model_ready else "starting", "model_loaded": model_ready})

@app.route("/predict", methods=["POST"])
@app.route("/api/predict", methods=["POST"])
def predict():
    # Basic checks
    if model is None:
        return jsonify({"error": "Model not loaded on server.", "status": "error"}), 503

    if "file" not in request.files:
        return jsonify({"error": "No file part in request", "status": "error"}), 400

    f = request.files["file"]
    if not f or f.filename is None or f.filename == "":
        return jsonify({"error": "No file selected", "status": "error"}), 400

    # Save secure unique file
    orig_name = secure_filename(f.filename)
    if not allowed_file(orig_name):
        return jsonify({"error": f"Unsupported file extension. Allowed: {sorted(ALLOWED_EXT)}", "status": "error"}), 400
    ext = Path(orig_name).suffix.lower() or ".jpg"
    fname = f"{uuid.uuid4().hex}{ext}"
    saved_path = UPLOAD_DIR / fname
    f.save(saved_path)

    try:
        # Preprocess image (must match training preprocessing exactly)
        img_array = preprocess_image(str(saved_path), target_size=(224, 224))

        # Predict (thread-safe)
        with model_lock:
            preds = model.predict(img_array, verbose=0)
        
        # Handle prediction shape: should be (1, num_classes) or (num_classes,)
        if preds.ndim == 2:
            if preds.shape[0] == 1:
                preds = preds[0]  # Remove batch dimension: (1, num_classes) -> (num_classes,)
            else:
                raise ValueError(f"Unexpected prediction shape: {preds.shape}")
        
        # Validate prediction shape
        if preds.shape[0] != NUM_CLASSES:
            raise ValueError(
                f"Model returned {preds.shape[0]} classes but labels.json has {NUM_CLASSES}. "
                f"Prediction shape: {preds.shape}"
            )

        # Ensure predictions are valid probabilities (sum to ~1.0)
        pred_sum = float(np.sum(preds))
        if not (0.99 <= pred_sum <= 1.01):
            print(f"⚠️ Warning: Prediction probabilities sum to {pred_sum:.4f}, expected ~1.0")

        # Build results dictionary: index -> probability percentage
        # Convert to percentages and round to 3 decimal places
        probs = (preds * 100).tolist()
        results: Dict[str, float] = {
            index_to_label[str(i)]: round(float(probs[i]), 3) 
            for i in range(NUM_CLASSES)
        }

        # Get best prediction (highest probability)
        best_idx = int(np.argmax(preds))
        best_label = index_to_label[str(best_idx)]
        confidence = round(float(preds[best_idx]) * 100, 3)
        
        # Debug output (only in debug mode)
        if DEBUG:
            print(f"Prediction: index={best_idx}, label={best_label}, confidence={confidence}%")
            print(f"All probabilities: {results}")

        # Build absolute URL for returned image (frontend can use it)
        img_url = request.host_url.rstrip("/") + f"/static/uploads/{fname}"

        # Get description and recommendation based on predicted disease
        # Map canonical name back from display name for lookup
        canonical_name = None
        for canon, display in display_map.items():
            if display == best_label:
                canonical_name = canon
                break
        if canonical_name is None:
            # Fallback: try to find in raw_index_to_label
            canonical_name = raw_index_to_label.get(str(best_idx), best_label)

        # Get disease description and recommendation
        disease_info = get_disease_info(canonical_name or best_label, confidence / 100.0)
        
        # Build response with required fields
        response = {
            "disease": best_label,  # Display name
            "confidence": confidence / 100.0,  # Float between 0 and 1
            "description": disease_info["description"],
            "recommendation": disease_info["recommendation"],
            # Additional fields for backward compatibility
            "predicted_label": best_label,
            "predicted_index": best_idx,
            "results": results,  # All class probabilities
            "img_url": img_url,
            "status": "success"
        }
        return jsonify(response)
    except Exception as e:
        return jsonify({"error": f"Prediction failed: {str(e)}", "status": "error"}), 500
    # Do not delete the file immediately - keep it in /static/uploads/ for frontend to fetch
    # Files will be cleaned up by a separate process or periodically

# Serve uploaded images
@app.route("/static/uploads/<filename>")
def uploaded_file(filename):
    return send_from_directory(UPLOAD_DIR, filename)

if __name__ == "__main__":
    # NOTE: For production, use gunicorn/uvicorn with --preload and set workers appropriately.
    # Render will set the PORT environment variable
    port = int(os.environ.get("PORT", 5004))
    app.run(host="0.0.0.0", port=port, debug=DEBUG)