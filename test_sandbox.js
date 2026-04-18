const busboy = require('busboy');

function parseMultipart(event) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Multipart parse timeout')), 3000);

    const contentType = event.headers['content-type'] || event.headers['Content-Type'] || '';

    if (!contentType.includes('multipart/') && !contentType.includes('urlencoded')) {
      clearTimeout(timer);
      return resolve({ fields: {}, files: {} });
    }

    try {
      const fields = {};
      const files  = {};
      const bb = busboy({ headers: { 'content-type': contentType }, limits: { fileSize: 5 * 1024 * 1024 } });

      bb.on('field', (name, val) => { fields[name] = val; });
      bb.on('file', (name, stream, info) => {
        const chunks = [];
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('end',  () => { files[name] = { buffer: Buffer.concat(chunks), ...info }; });
      });

      const onDone = () => {
        clearTimeout(timer);
        resolve({ fields, files });
      };

      bb.on('close', onDone);
      bb.on('finish', onDone);
      bb.on('error', (err) => { clearTimeout(timer); reject(err); });

      const bodyBuffer = event.isBase64Encoded
        ? Buffer.from(event.body, 'base64')
        : Buffer.from(event.body || '', 'binary');

      bb.end(bodyBuffer);
    } catch (err) {
      clearTimeout(timer);
      reject(err);
    }
  });
}

const mockEvent = {
  headers: {
    'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
  },
  isBase64Encoded: false,
  body: '------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name="companyName"\r\n\r\nTest Corp\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name="senderEmail"\r\n\r\nhr@testcorp.com\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW--\r\n'
};

(async () => {
  try {
    console.log('Testing parseMultipart...');
    const result = await parseMultipart(mockEvent);
    console.log('Success!', result);
  } catch (err) {
    console.error('Error!', err);
  }
})();
