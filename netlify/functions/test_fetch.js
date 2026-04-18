const http = require('http');

const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
const body = 
  '--' + boundary + '\r\n' +
  'Content-Disposition: form-data; name="companyName"\r\n\r\n' +
  'Test Corp\r\n' +
  '--' + boundary + '\r\n' +
  'Content-Disposition: form-data; name="senderEmail"\r\n\r\n' +
  'hr@testcorp.com\r\n' +
  '--' + boundary + '\r\n' +
  'Content-Disposition: form-data; name="offerContent"\r\n\r\n' +
  'We will pay you lots of money upfront!\r\n' +
  '--' + boundary + '--\r\n';

const options = {
  hostname: 'localhost',
  port: 8888,
  path: '/.netlify/functions/analyze',
  method: 'POST',
  headers: {
    'Content-Type': 'multipart/form-data; boundary=' + boundary,
    'Content-Length': Buffer.byteLength(body)
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('STATUS:', res.statusCode);
    console.log('BODY:', data);
  });
});

req.on('error', (e) => {
  console.error('Request error:', e.message);
});

req.write(body);
req.end();
