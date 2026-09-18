const fs = require('fs');

function cleanEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const cleaned = lines.map((line) => {
    if (line.startsWith('DATABASE_URL=')) {
      let val = line.substring('DATABASE_URL='.length).trim();
      val = val.replace(/^["']+|["']+$/g, '');
      return `DATABASE_URL="${val}"`;
    }
    if (line.startsWith('DIRECT_URL=')) {
      let val = line.substring('DIRECT_URL='.length).trim();
      val = val.replace(/^["']+|["']+$/g, '');
      return `DIRECT_URL="${val}"`;
    }
    return line;
  });
  fs.writeFileSync(filePath, cleaned.join('\n'), 'utf-8');
}

cleanEnvFile('.env');
cleanEnvFile('packages/database/.env');
console.log('Cleaned env files successfully');
