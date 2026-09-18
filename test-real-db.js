const { prisma } = require('./packages/database/dist/index.js');

async function test() {
  try {
    console.log('Connecting via @prisma/adapter-pg + pg driver...');
    const userCount = await prisma.user.count();
    console.log('>>> SUCCESS! User count from real DB:', userCount);
    const shopCount = await prisma.shop.count();
    console.log('>>> SUCCESS! Shop count from real DB:', shopCount);
    const prodCount = await prisma.product.count();
    console.log('>>> SUCCESS! Product count from real DB:', prodCount);
    const shops = await prisma.shop.findMany({ select: { name: true, slug: true } });
    console.log('>>> Shops:', shops);
    const users = await prisma.user.findMany({ select: { email: true, name: true } });
    console.log('>>> Users:', users);
  } catch (err) {
    console.error('FAILED TO QUERY DB:', err);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

test();
