const fs = require('fs');

function switchToPort5432(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const updated = lines.map((line) => {
    if (line.startsWith('DATABASE_URL=')) {
      let val = line.substring('DATABASE_URL='.length).trim();
      val = val.replace(/^["']+|["']+$/g, '');
      val = val.replace(':6543/', ':5432/');
      val = val.replace(/pgbouncer=true&?/g, '');
      val = val.replace(/connection_limit=\d+&?/g, '');
      val = val.replace(/\?$/, '');
      if (!val.includes('?')) {
        val += '?connection_limit=1';
      } else {
        val += '&connection_limit=1';
      }
      return `DATABASE_URL="${val}"`;
    }
    return line;
  });
  fs.writeFileSync(filePath, updated.join('\n'), 'utf-8');
}

switchToPort5432('.env');
switchToPort5432('packages/database/.env');
console.log('Switched to port 5432 with connection_limit=1');
