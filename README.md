# 🧪 Diabetes Risk Predictor Web App

This web application predicts the risk of diabetes using both **user-entered data** and optional **medical report images**. It uses:

- A **Node.js backend** for OCR and managing inputs
- A **Python Flask API** with a trained machine learning model
- A clean and responsive frontend for user interaction

---

## 📁 Project Structure

```
Project Root
├── backend/
│   ├── server.js              # Node.js API (OCR, user input, Python call)
│   └── diab_model.h5          # Trained diabetes model (Keras .h5 format)
├── python/
│   └── diabetes_api.py        # Flask app with model inference
├── public/
│   ├── index.html             # User interface
│   ├── style.css              # CSS styling
│   └── script.js              # Frontend JS (fetch, input handling)
└── README.md                  # You're reading it!
```

---

## 🚀 How to Run

### 1. Backend - Python API
Install required packages:

```bash
cd python
pip install flask flask-cors numpy tensorflow joblib
python diabetes_api.py
```

It runs on: `http://localhost:5000`

---

### 2. Backend - Node.js Server

```bash
cd backend
npm install express multer axios form-data cors
node server.js
```

It runs on: `http://localhost:3000`

---

### 3. Frontend

You can open `public/index.html` directly in your browser (or serve it via Express).

To test manually, run:

```bash
cd public
# open index.html manually in browser
```

---

## 📤 Inputs

The form collects the following values:

| Field                      | Units         | Example | Range / Default |
|---------------------------|---------------|---------|-----------------|
| Pregnancies               | count          | 2       | 0-10            |
| Glucose                   | mg/dL          | 120     | > 0             |
| Blood Pressure            | mm Hg          | 70      | > 0             |
| Skin Thickness            | mm             | 20      | > 0             |
| Insulin                   | µU/mL          | 85      | > 0             |
| BMI                       | kg/m²          | 32.0    | > 0             |
| Diabetes Pedigree Function| ratio (0-1+)   | 0.45    | > 0             |
| Age                       | years          | 33      | > 0             |

You can upload up to **5 report images** (e.g., **Fasting Glucose**, **PP Glucose**, **CBC**, etc.).

---

## 🧠 Output

The result includes:

- **Prediction**: `"High Risk of Diabetes"` or `"Low Risk of Diabetes"`
- **Confidence**: (e.g., `"Risk: 74%"`)
- **OCR Extracted Text** (for debugging)

---

## 🧪 Testing with Postman

To send manual input:

**POST** `http://localhost:3000/diabetes_process`

Body: `form-data`
- All 8 input fields
- Optional image uploads (key: `images`, allow multiple)

---

## 🧾 Reports to Upload

You can upload any of these medical test reports:
- **Blood Glucose (Fasting / PP)**
- **Insulin**
- **Complete Blood Count (CBC)**
- **BMI Report** (if available)

These are parsed automatically using OCR.

---

## ✍️ Notes

- If a value is **unknown**, enter `-1`
- Default values will be used in such cases
- Add more validations and improve model accuracy by feeding more clean data

---

## 👨‍💻 Author

Made with ❤️ by Harsh Sethi  
Built using Node.js, Python, TensorFlow, and OCR APIs.
