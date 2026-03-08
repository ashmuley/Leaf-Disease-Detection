from fastapi import FastAPI, UploadFile, File
from typing import List
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import json

app = FastAPI()

print("Loading AI Model...")
model = tf.keras.models.load_model("best_crop_model.keras")

print("Loading Class Names...")
with open("class_names.txt") as f:
    class_names = [line.strip() for line in f.readlines()]

print("Loading Prescription Data...")
with open("crop_data.json", "r") as json_file:
    crop_database_list = json.load(json_file)

# Build the Dictionary Mapping
prescription_map = {}
for i, class_name in enumerate(class_names):
    # This pairs index 0 from the text file with index 0 from the JSON
    prescription_map[class_name] = crop_database_list[i]

print("Successfully mapped all 37 AI classes to their prescriptions!")

IMG_SIZE = (224, 224)
CONFIDENCE_THRESHOLD = 0.60  # 60% minimum confidence to be considered a valid leaf

def preprocess(img):
    img = img.resize(IMG_SIZE)
    img = np.array(img) / 255.0
    img = np.expand_dims(img, axis=0)
    return img


@app.post("/predict")
async def predict(files: List[UploadFile] = File(...)):
    
    # Security check
    if len(files) > 4:
        return {"success": False, "error": "Maximum of 4 images allowed."}

    valid_predictions = []
    predicted_classes = []
    individual_results = []

    # 1. Evaluate each image individually
    for i, file in enumerate(files):
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        img = preprocess(image)
        
        pred = model.predict(img)
        
        conf = float(np.max(pred[0]))
        index = int(np.argmax(pred[0]))
        pred_class = class_names[index]
        
        # Filter garbage/unclear images
        if conf < CONFIDENCE_THRESHOLD:
            individual_results.append({
                "image": file.filename,
                "status": "Rejected",
                "reason": "Low confidence or unrecognizable leaf",
                "confidence": round(conf * 100, 2)
            })
        else:
            individual_results.append({
                "image": file.filename,
                "status": "Accepted",
                "predicted_class": pred_class,
                "confidence": round(conf * 100, 2)
            })
            valid_predictions.append(pred[0])
            predicted_classes.append(pred_class)

    # 2. If all images were garbage
    if len(valid_predictions) == 0:
        return {
            "success": False,
            "error": "Could not confidently detect a leaf in any of the uploaded images. Please try again with clear photos.",
            "details": individual_results
        }

    # 3. Check for mixed diseases/crops
    unique_classes = set(predicted_classes)
    if len(unique_classes) > 1:
        return {
            "success": False,
            "error": "Multiple different crops or diseases detected. Please upload images of only one specific plant issue at a time.",
            "detected_mix": list(unique_classes),
            "details": individual_results
        }

    # 4. Calculate final stable prediction
    avg_prediction = np.mean(valid_predictions, axis=0)
    final_confidence = float(np.max(avg_prediction))
    final_index = int(np.argmax(avg_prediction))
    final_class = class_names[final_index]

    # 5. FETCH THE PRESCRIPTION using our globally loaded map
    matched_prescription = prescription_map.get(final_class, {"error": "Data not found"})

    return {
        "success": True,
        "ai_prediction": {
            "raw_class": final_class,
            "confidence": round(final_confidence * 100, 2),
        },
        "prescription": matched_prescription, # <-- Pasted here!
        "stats": {
            "images_uploaded": len(files),
            "images_accepted_by_ai": len(valid_predictions)
        },
        "details": individual_results
    }