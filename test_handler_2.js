require('dotenv').config({ path: '.env.local' });
const { handler } = require('./netlify/functions/analyze.js');
const fs = require('fs');

(async () => {
  try {
    const event = {
      httpMethod: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        companyName: 'Acme',
        senderEmail: 'hr@acmecorp.com',
        offerContent: 'We are pleased to offer you this job.'
      })
    };

    const res = await handler(event);
    fs.writeFileSync('test_out.txt', JSON.stringify(res, null, 2));
  } catch (e) {
    fs.writeFileSync('test_out.txt', "FATAL ERROR: " + e.stack);
  }
})();
