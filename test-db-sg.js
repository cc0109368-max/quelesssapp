const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const envConfig = dotenv.parse(fs.readFileSync(path.join(__dirname, '.env')));
const rawUrl = envConfig.DATABASE_URL;

const { PrismaClient } = require('@prisma/client');

async function run() {
  const variations = [
    { name: 'Direct Host aws-0-ap-southeast-1.pooler.supabase.com:6543', url: rawUrl.replace('127.0.0.1:6543', 'aws-0-ap-southeast-1.pooler.supabase.com:6543') },
    { name: 'Direct IPv4 52.77.146.31:6543', url: rawUrl.replace('127.0.0.1:6543', '52.77.146.31:6543') },
    { name: 'Direct IPv4 54.255.219.82:6543', url: rawUrl.replace('127.0.0.1:6543', '54.255.219.82:6543') },
    { name: 'Session Mode 52.77.146.31:5432', url: rawUrl.replace('127.0.0.1:6543', '52.77.146.31:5432').replace('pgbouncer=true&', '') },
  ];

  for (const v of variations) {
    console.log(`\nTesting: ${v.name}`);
    const prisma = new PrismaClient({ datasources: { db: { url: v.url } } });
    try {
      await prisma.$connect();
      const userCount = await prisma.user.count();
      const productCount = await prisma.product.count();
      const catCount = await prisma.category.count();
      const orderCount = await prisma.order.count();
      console.log(`>>> SUCCESS for ${v.name}!`);
      console.log(`Users: ${userCount}, Products: ${productCount}, Categories: ${catCount}, Orders: ${orderCount}`);
      await prisma.$disconnect();
      return v.url;
    } catch (e) {
      console.log(`FAILED: ${e.message}`);
      await prisma.$disconnect();
    }
  }
}

run().catch(console.error);
