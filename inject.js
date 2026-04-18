const fs = require('fs');

try {
  const serviceJson = JSON.parse(fs.readFileSync('./netlify/service.json', 'utf8'));
  const minifiedStr = JSON.stringify(serviceJson);

  let envContent = fs.readFileSync('./netlify/.env', 'utf8');

  // Replace or append FIREBASE_SERVICE_ACCOUNT
  if (envContent.includes('FIREBASE_SERVICE_ACCOUNT=')) {
    // Regex to accurately match and replace the whole line
    envContent = envContent.replace(
      /^FIREBASE_SERVICE_ACCOUNT=.*$/m,
      `FIREBASE_SERVICE_ACCOUNT='${minifiedStr}'`
    );
  } else {
    envContent += `\nFIREBASE_SERVICE_ACCOUNT='${minifiedStr}'\n`;
  }

  fs.writeFileSync('./netlify/.env', envContent);
  console.log('Successfully injected service.json into netlify/.env');
} catch (err) {
  console.error('Error injecting:', err.message);
}
