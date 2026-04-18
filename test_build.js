const fs = require('fs');
const { execSync } = require('child_process');
try {
  const out = execSync('npx vite build', { encoding: 'utf-8' });
  fs.writeFileSync('test_build.txt', out);
} catch(e) {
  fs.writeFileSync('test_build.txt', e.stdout ? e.stdout.toString() + '\\n' + e.stderr.toString() : e.message);
}
