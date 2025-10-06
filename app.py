from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
import os, json, uuid
from flask_cors import CORS

APP_ROOT = os.path.dirname(os.path.abspath(__file__))

app = Flask(__name__)
# Enable CORS for all routes with specific configuration
CORS(app, resources={r"/*": {"origins": "*"}})

MODEL_PATH = os.path.join(APP_ROOT, "plant_disease_model.h5")
LABELS_PATH = os.path.join(APP_ROOT, "labels.json")

# Load model
model = load_model(MODEL_PATH, compile=False)

# Load labels / display names
if os.path.exists(LABELS_PATH):
    with open(LABELS_PATH, "r", encoding="utf-8") as f:
        labels_data = json.load(f)
    class_order = labels_data.get("indices", ["Powdery_mildew", "Leaf_Spot", "Aphids", "Healthy"])
    display_labels = labels_data.get("display", ["Powdery mildew", "Leaf spot", "Aphids (Aphis sp.)", "Healthy"])
else:
    class_order = ["Powdery_mildew", "Leaf_Spot", "Aphids", "Healthy"]
    display_labels = ["Powdery mildew", "Leaf spot", "Aphids (Aphis sp.)", "Healthy"]

UPLOAD_DIR = os.path.join(APP_ROOT, "static", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Add root route to prevent "Not Found" error
@app.route("/")
def index():
    return jsonify({"message": "LEAF Disease Detection API is running", "status": "success"})

@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    f = request.files["file"]
    if f.filename == "":
        return jsonify({"error": "No file selected"}), 400

    # Save to static/uploads with a unique name
    ext = os.path.splitext(f.filename)[1].lower()
    fname = f"{uuid.uuid4().hex}{ext}"
    saved_path = os.path.join(UPLOAD_DIR, fname)
    f.save(saved_path)

    # Preprocess exactly as training: 224x224, scaled 0..1
    img = image.load_img(saved_path, target_size=(224, 224))
    x = image.img_to_array(img) / 255.0
    x = np.expand_dims(x, axis=0)

    # Predict
    preds = model.predict(x)[0]  # shape (4,)
    probs = (preds * 100.0).astype(float)

    # Map to display labels in the known order (indices 0..3)
    results = {display_labels[i]: round(float(probs[i]), 2) for i in range(len(display_labels))}
    top_idx = int(np.argmax(probs))
    top_label = display_labels[top_idx]
    top_conf = round(float(probs[top_idx]), 2)

    img_url = f"/static/uploads/{fname}"
    
    # Return JSON response for API compatibility
    return jsonify({
        "predicted_label": top_label,
        "confidence": top_conf,
        "results": results,
        "img_url": img_url
    })

# Add a new API endpoint for health check
@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "healthy", "message": "LEAF Disease Detection API is running"})

# Add a new API endpoint for prediction (to match the React frontend expectation)
@app.route("/api/predict", methods=["POST"])
def api_predict():
    return predict()  # Reuse the existing predict function

if __name__ == "__main__":
    # from waitress import serve
    app.run(host='0.0.0.0', port=5003, debug=True)
    # serve(app, host='0.0.0.0', port=5000)