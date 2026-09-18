const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const dotenv = require('dotenv');
const env = dotenv.parse(fs.readFileSync('.env'));
const m = env.DATABASE_URL.match(/:([^:@]+)@/);
const password = m ? m[1] : '';

const users = ['postgres.nuxajrduruxfgmboscjh', 'postgres'];
async function test() {
  for (const u of users) {
    const url = 'postgresql://' + u + ':' + encodeURIComponent(password) + '@127.0.0.1:16543/postgres?sslmode=disable';
    console.log('Testing SNI proxy with user:', u);
    const prisma = new PrismaClient({ datasources: { db: { url } } });
    try {
      await prisma.$connect();
      console.log('>>> SUCCESS with SNI proxy!');
      const c = await prisma.user.count();
      console.log('User count:', c);
      await prisma.$disconnect();
      return;
    } catch (e) {
      console.log('Error:', e.message.split('\n')[0]);
      await prisma.$disconnect();
    }
  }
}
test();
