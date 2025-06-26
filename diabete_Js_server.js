const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const fetch = require('node-fetch');

const app = express();
const PORT = 3000;
const OCR_API_KEY = 'K86266403288957';

app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

// let diabetesDefaultInput = [2, 120, 70, 20, 85, 32.0, 0.45, 33];

// const fieldToIndex = {
//   Pregnancies: 0,
//   Glucose: 1,
//   BloodPressure: 2,
//   SkinThickness: 3,
//   Insulin: 4,
//   BMI: 5,
//   DiabetesPedigreeFunction: 6,
//   Age: 7
// };

app.post('/diabetes_process', upload.array('images', 5), async (req, res) => {
  let diabetesDefaultInput = [2, 120, 70, 20, 85, 32.0, 0.45, 33];

const fieldToIndex = {
  Pregnancies: 0,
  Glucose: 1,
  BloodPressure: 2,
  SkinThickness: 3,
  Insulin: 4,
  BMI: 5,
  DiabetesPedigreeFunction: 6,
  Age: 7
};  
  const manualInput = req.body; // e.g., from a JSON object
  const results = [];

   // 2. OCR processing for each uploaded image
  for (const file of req.files) {
    const filePath = file.path;
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath), {
      filename: file.originalname,
      contentType: file.mimetype
    });
    form.append('apikey', OCR_API_KEY);
    form.append('language', 'eng');
    form.append('OCREngine', '2');
    form.append('isOverlayRequired', 'false');
    form.append('scale', 'true');
    form.append('isTable', 'true');

    try {
      const ocrResponse = await axios.post('https://api.ocr.space/parse/image', form, {
        headers: {
          ...form.getHeaders(),
          'Content-Type': `multipart/form-data; boundary=${form._boundary}`
        },
        maxBodyLength: Infinity,
        timeout: 30000
      });

      fs.unlinkSync(filePath);

      if (ocrResponse.data.IsErroredOnProcessing) {
        return res.status(400).json({ error: 'OCR failed', details: ocrResponse.data.ErrorMessage });
      }

      const parsedText = ocrResponse.data.ParsedResults?.[0]?.ParsedText || 'No text found';
      results.push(parsedText);

      // Optional: match values from parsedText and update diabetesDefaultInput if needed
      // (you can add parsing logic here)

    } catch (error) {
      fs.unlinkSync(filePath);
      return res.status(500).json({ error: 'OCR error', details: error?.response?.data || error.message });
    }
  }
  
  // 1. Update default values based on manual inputs
  for (const key in manualInput) {
    if (fieldToIndex.hasOwnProperty(key)) {
      diabetesDefaultInput[fieldToIndex[key]] = parseFloat(manualInput[key]);
    }
  }

 

  // 3. Send final input to Python API
  try {
    const response = await fetch('http://127.0.0.1:5000/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: diabetesDefaultInput })
    });

    const prediction = await response.json();
    res.json({ prediction,confidence: prediction.confidence, usedInput: diabetesDefaultInput, extractedText: results });
  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).json({ error: 'Failed to get prediction from Python API' });
  }
});

app.listen(PORT, () => {
  console.log(`Node.js server running on http://localhost:${PORT}`);
});
