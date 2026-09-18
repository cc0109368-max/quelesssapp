const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const dotenv = require('dotenv');
const env = dotenv.parse(fs.readFileSync('.env'));
const m = env.DATABASE_URL.match(/:([^:@]+)@/);
const password = m ? m[1] : '';

const ips = ['52.77.146.31', '54.255.219.82', '52.74.252.201'];
const users = ['postgres.nuxajrduruxfgmboscjh', 'postgres'];

async function check() {
  for (const ip of ips) {
    for (const u of users) {
      for (const port of [6543, 5432]) {
        const url = 'postgresql://' + u + ':' + encodeURIComponent(password) + '@' + ip + ':' + port + '/postgres?sslmode=require' + (port === 6543 ? '&pgbouncer=true' : '');
        console.log('Testing: ' + ip + ':' + port + ' user=' + u);
        const prisma = new PrismaClient({ datasources: { db: { url } } });
        try {
          await prisma.$connect();
          console.log('>>> SUCCESS with: ' + ip + ':' + port + ' ' + u);
          const count = await prisma.user.count();
          console.log('User count:', count);
          await prisma.$disconnect();
          return;
        } catch (e) {
          console.log('  Error:', e.message.split('\n')[0]);
          await prisma.$disconnect();
        }
      }
    }
  }
}
check();
