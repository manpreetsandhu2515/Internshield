const formData = new FormData();
formData.append('companyName', 'Acme');
formData.append('senderEmail', 'hr@acme.com');
formData.append('offerContent', 'Test offer');

fetch('http://localhost:9999/.netlify/functions/analyze', {
  method: 'POST',
  body: formData
}).then(res => res.text()).then(text => {
  console.log('9999 Response:', text);
}).catch(err => {
  console.error('9999 Error:', err);
});

fetch('http://localhost:5173/.netlify/functions/analyze', {
  method: 'POST',
  body: formData
}).then(res => res.text()).then(text => {
  console.log('5173 Response:', text);
}).catch(err => {
  console.error('5173 Error:', err);
});
