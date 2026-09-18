require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function test() {
  try {
    const shops = await prisma.shop.findMany();
    console.log('SUCCESS: Connected to DB. Found shops:', shops.length);
    if (shops.length > 0) {
      console.log('Sample shop:', shops[0].name, 'slug:', shops[0].slug);
    }
  } catch (err) {
    console.error('FAILED:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();
