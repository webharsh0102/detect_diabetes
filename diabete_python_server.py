# heart_api.py
from flask import Flask, request, jsonify
import numpy as np
import joblib
from tensorflow import keras
import re
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS

# Load model and scaler
model = keras.models.load_model('diab_model.h5')
scaler = joblib.load('scaler_diab.save')

def extract_value(text, key):
    match = re.search(rf"{key}[:\s]*([\d.]+)", text, re.IGNORECASE)
    return float(match.group(1)) if match else -1

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json['input']
    scaled = scaler.transform([data])
    prediction = model.predict(scaled)
    probability = model.predict(scaled)[0][0]
    # result = int(prediction[0][0] >= 0.5)
    return jsonify({
        'prediction': round(float(probability), 4),
        'confidence': round(float(probability), 4)  # Optional: round to 4 decimals
    })

# @app.route('/parse-and-predict', methods=['POST'])
# def parse_and_predict():
#     data = request.get_json()
#     texts = data['texts']
#     combined_text = "\n".join(texts)

#     # Order: age, sex, cp, trestbps, chol, fbs, restecg, thalach, exang, oldpeak, slope, ca, thal
#     default_input = [63, 1, 3, 145, 233, 1, 0, 150, 0, 2.3, 0, 0, 1]
#     keys = [
#         ('trestbps|bp|blood pressure', 3),
#         ('chol|cholesterol', 4),
#         ('thalach|max heart rate', 7),
#         ('oldpeak', 9),
#         ('slope', 10),
#         ('ca', 11),
#         ('thal', 12),
#     ]

#     for pattern, index in keys:
#         val = extract_value(combined_text, pattern)
#         if val != -1:
#             default_input[index] = val

#     scaled = scaler.transform([default_input])
#     prediction = model.predict(scaled)
#     result = int(prediction[0][0] >= 0.5)

#     return jsonify({
#         'input': default_input,
#         'prediction': result
#     })

if __name__ == '__main__':
    app.run(port=5000)
