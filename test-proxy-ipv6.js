const { spawn } = require('child_process');
const fs = require('fs');
const dotenv = require('dotenv');
const env = dotenv.parse(fs.readFileSync('.env'));
const m = env.DATABASE_URL.match(/:([^:@]+)@/);
const password = m ? m[1] : '';

const proxy = spawn('node', ['supabase-proxy.cjs'], { stdio: 'inherit' });

setTimeout(async () => {
  const { PrismaClient } = require('@prisma/client');
  const directUrl = 'postgresql://postgres:' + encodeURIComponent(password) + '@127.0.0.1:5432/postgres?sslmode=require';
  console.log('Testing direct IPv6 proxy URL on 127.0.0.1:5432 with user postgres...');
  const prisma = new PrismaClient({ datasources: { db: { url: directUrl } } });
  try {
    const userCount = await prisma.user.count();
    console.log('>>> SUCCESS! User count:', userCount);
    const shopCount = await prisma.shop.count();
    console.log('>>> SUCCESS! Shop count:', shopCount);
    const prodCount = await prisma.product.count();
    console.log('>>> SUCCESS! Product count:', prodCount);
  } catch (err) {
    console.error('ERROR:', err.message);
  } finally {
    await prisma.$disconnect();
    proxy.kill();
    process.exit(0);
  }
}, 2000);
