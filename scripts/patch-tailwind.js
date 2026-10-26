const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '..', 'node_modules', 'tailwindcss', 'lib', 'lib', 'setupContextUtils.js');

if (fs.existsSync(targetFile)) {
  let content = fs.readFileSync(targetFile, 'utf8');
  if (content.includes('decodeURIComponent(pathname)')) {
    content = content.replace(
      'let newModified = (_fs_statSync = _fs.default.statSync(decodeURIComponent(pathname), {',
      `let safePath = pathname;
        try {
            safePath = decodeURIComponent(pathname);
        } catch (_e) {
            safePath = pathname;
        }
        let newModified = (_fs_statSync = _fs.default.statSync(safePath, {`
    );
    fs.writeFileSync(targetFile, content, 'utf8');
    console.log('[patch-tailwind] Patched setupContextUtils.js successfully.');
  }
}
