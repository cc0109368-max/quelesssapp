const fs = require('fs');

function updateToTransactionPooler(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const updated = lines.map((line) => {
    if (line.startsWith('DATABASE_URL=')) {
      let val = line.substring('DATABASE_URL='.length).trim();
      val = val.replace(/^["']+|["']+$/g, '');
      
      // Replace port to 6543
      val = val.replace(':5432/', ':6543/');
      
      // Clean old query params
      const [baseUrl] = val.split('?');
      return `DATABASE_URL="${baseUrl}?pgbouncer=true&connection_limit=1"`;
    }
    return line;
  });
  fs.writeFileSync(filePath, updated.join('\n'), 'utf-8');
}

updateToTransactionPooler('.env');
updateToTransactionPooler('packages/database/.env');
console.log('Successfully switched DATABASE_URL to port 6543 transaction pooler');
