const fs = require('fs');

function fix(p) {
  if (!fs.existsSync(p)) return;
  const content = fs.readFileSync(p, 'utf-8');
  const lines = content.split('\n').map((l) => {
    if (l.startsWith('DATABASE_URL=')) {
      return l.replace('/postgres%22', '/postgres').replace('/postgres"', '/postgres"');
    }
    return l;
  });
  fs.writeFileSync(p, lines.join('\n'), 'utf-8');
}

fix('.env');
console.log('Done');
