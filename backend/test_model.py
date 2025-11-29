import os
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image as keras_image
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input

# Load the model
model = load_model("plant_disease_model.h5")
print("Model loaded successfully!")

# Load labels
import json
with open("labels.json", "r") as f:
    labels_data = json.load(f)

class_order = labels_data.get("indices", ["Powdery_mildew", "Leaf_Spot", "Aphids", "Healthy"])
index_to_label = labels_data.get("index_to_label", {str(i): class_order[i] for i in range(len(class_order))})

print("Class order:", class_order)
print("Index to label mapping:", index_to_label)

# Test with a sample image
test_image_path = "dataset/validation/Powdery_mildew/WhatsApp Image 2025-08-18 at 12.54.00 AM.jpeg"

if os.path.exists(test_image_path):
    # Preprocess the image
    img = keras_image.load_img(test_image_path, target_size=(224, 224))
    arr = keras_image.img_to_array(img).astype("float32")
    arr = preprocess_input(arr)
    arr = np.expand_dims(arr, axis=0)
    
    # Make prediction
    preds = model.predict(arr, verbose=0)
    if preds.ndim == 2:
        preds = preds[0]
    
    print("Prediction shape:", preds.shape)
    print("Number of classes:", len(class_order))
    
    # Get results
    probs = (preds * 100).tolist()
    results = {index_to_label[str(i)]: round(float(probs[i]), 3) for i in range(len(class_order))}
    
    # Best prediction
    best_idx = int(np.argmax(preds))
    best_label = index_to_label[str(best_idx)]
    confidence = round(float(preds[best_idx]) * 100, 3)
    
    print("Results:", results)
    print("Best prediction:", best_label, "with confidence:", confidence, "%")
else:
    print("Test image not found at", test_image_path)