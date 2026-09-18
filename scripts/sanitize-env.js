const fs = require('fs');

function sanitizeFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const updated = lines.map((line) => {
    if (line.startsWith('DATABASE_URL=') || line.startsWith('DIRECT_URL=')) {
      const key = line.startsWith('DATABASE_URL=') ? 'DATABASE_URL' : 'DIRECT_URL';
      let val = line.substring(key.length + 1).trim();
      val = val.replace(/^["']+|["']+$/g, '');
      val = val.replace('%22', '');
      val = val.replace(/"+/g, '');
      return `${key}="${val}"`;
    }
    return line;
  });
  fs.writeFileSync(filePath, updated.join('\n'), 'utf-8');
}

sanitizeFile('.env');
sanitizeFile('packages/database/.env');
console.log('Sanitized env files cleanly');
