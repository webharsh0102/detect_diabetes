document.getElementById('predictForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const formData = new FormData(this);
  const jsonBody = {};
  formData.forEach((value, key) => {
    if (key !== 'images') jsonBody[key] = value;
  });

  const imageFiles = formData.getAll('images');

  const uploadForm = new FormData();
  Object.entries(jsonBody).forEach(([key, value]) => {
    uploadForm.append(key, value);
  });

  for (let file of imageFiles) {
    uploadForm.append('images', file);
  }

  const response = await fetch('http://localhost:3000/diabetes_process', {
    method: 'POST',
    body: uploadForm
  });

  const data = await response.json();
  document.getElementById('result').innerText = 
  'Prediction: ' + ((data.confidence) >= 0.5  ? 'High Risk of Diabetes' : 'Low Risk of Diabetes') +
  '\nrisk : ' + Math.round(data.confidence * 100) + '%';

});
