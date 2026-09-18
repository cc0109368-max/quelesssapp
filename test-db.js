const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const envConfig = dotenv.parse(fs.readFileSync(path.join(__dirname, '.env')));
const rawUrl = envConfig.DATABASE_URL;

const { PrismaClient } = require('@prisma/client');

async function run() {
  const variations = [
    { name: 'As in .env', url: rawUrl },
    { name: 'Host aws-0-ap-south-1.pooler.supabase.com', url: rawUrl.replace(/@[^:]+:/, '@aws-0-ap-south-1.pooler.supabase.com:') },
    { name: 'IPv4 3.111.105.85', url: rawUrl.replace(/@[^:]+:/, '@3.111.105.85:') },
    { name: 'IPv4 65.0.195.55', url: rawUrl.replace(/@[^:]+:/, '@65.0.195.55:') },
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
      console.log(`FAILED: ${e.message.split('\n')[0]}`);
      await prisma.$disconnect();
    }
  }
}

run().catch(console.error);
