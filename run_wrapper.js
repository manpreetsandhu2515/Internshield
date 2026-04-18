const fs = require('fs');
const { execSync } = require('child_process');
try {
  const out = execSync('node test_handler_2.js', { env: process.env }).toString();
  fs.writeFileSync('test_out.txt', out);
} catch(e) {
  fs.writeFileSync('test_out.txt', e.stdout ? e.stdout.toString() + '\\n' + e.stderr.toString() : e.message);
}
