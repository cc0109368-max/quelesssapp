import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

import { prisma } from '../src/index';
import bcrypt from 'bcryptjs';

function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

async function main() {
  console.log('🌱 Starting QueueLess idempotent database seed...\n');

  // Check if shop already exists
  let shop = await prisma.shop.findUnique({
    where: { slug: 'sri-lakshmi-tea' },
  });

  if (!shop) {
    shop = await prisma.shop.create({
      data: {
        name: 'Sri Lakshmi Tea & Snacks',
        slug: 'sri-lakshmi-tea',
        description: 'Tea • Coffee • Snacks • Juices • Cakes • Ice Creams • Hot Food',
        status: 'OPEN',
        openTime: '06:00',
        closeTime: '22:00',
        onlinePaymentEnabled: true,
        cashPaymentEnabled: true,
        taxPercent: 5.0,
        orderPrefix: 'A',
        dailyOrderSeq: 100,
        lastOrderDate: '',
      },
    });
    console.log(`✅ Created Shop: ${shop.name} (${shop.slug})`);
  } else {
    console.log(`ℹ️ Shop already exists: ${shop.name} (${shop.slug})`);
  }

  // ---- Counters ----
  const counterDefs = [
    { name: 'Tea Counter', code: 'TEA' },
    { name: 'Snacks Counter', code: 'SNK' },
    { name: 'Juice & Dessert Counter', code: 'JIC' },
    { name: 'Food Counter', code: 'FOOD' },
  ];

  const counters: Record<string, string> = {};
  for (const c of counterDefs) {
    let counter = await prisma.counter.findUnique({
      where: { shopId_code: { shopId: shop.id, code: c.code } },
    });
    if (!counter) {
      counter = await prisma.counter.create({
        data: { shopId: shop.id, name: c.name, code: c.code, isActive: true },
      });
      console.log(`✅ Created Counter: ${c.name}`);
    }
    counters[c.code] = counter.id;
  }

  // ---- Categories ----
  const catData = [
    { name: 'Tea & Coffee', slug: 'tea-coffee', sortOrder: 0 },
    { name: 'Snacks', slug: 'snacks', sortOrder: 1 },
    { name: 'Juices', slug: 'juices', sortOrder: 2 },
    { name: 'Cakes', slug: 'cakes', sortOrder: 3 },
    { name: 'Ice Creams', slug: 'ice-creams', sortOrder: 4 },
    { name: 'Food', slug: 'food', sortOrder: 5 },
    { name: 'Cool Drinks', slug: 'cool-drinks', sortOrder: 6 },
    { name: 'Bakery', slug: 'bakery', sortOrder: 7 },
    { name: 'Other', slug: 'other', sortOrder: 8 },
  ];

  const categories: Record<string, string> = {};
  for (const c of catData) {
    let cat = await prisma.category.findUnique({
      where: { shopId_slug: { shopId: shop.id, slug: c.slug } },
    });
    if (!cat) {
      cat = await prisma.category.create({
        data: { shopId: shop.id, ...c, isActive: true },
      });
      console.log(`✅ Created Category: ${c.name}`);
    }
    categories[c.slug] = cat.id;
  }

  // ---- Products ----
  const products = [
    // --- Tea & Coffee ---
    { name: 'Tea', description: 'Freshly brewed hot milk tea', price: 15, categoryId: categories['tea-coffee'], counterId: counters['TEA'], sortOrder: 0 },
    { name: 'Masala Tea', description: 'Spiced Indian chai with cloves, ginger & cardamom', price: 20, categoryId: categories['tea-coffee'], counterId: counters['TEA'], sortOrder: 1 },
    { name: 'Coffee', description: 'Fresh hot brewed coffee', price: 25, categoryId: categories['tea-coffee'], counterId: counters['TEA'], sortOrder: 2 },
    { name: 'Filter Coffee', description: 'Traditional South Indian chicory filter coffee', price: 25, categoryId: categories['tea-coffee'], counterId: counters['TEA'], sortOrder: 3 },
    { name: 'Ginger Tea', description: 'Hot tea with freshly crushed ginger', price: 20, categoryId: categories['tea-coffee'], counterId: counters['TEA'], sortOrder: 4 },
    { name: 'Cardamom Tea', description: 'Fragrant elaichi tea with fresh milk', price: 20, categoryId: categories['tea-coffee'], counterId: counters['TEA'], sortOrder: 5 },

    // --- Snacks ---
    { name: 'Samosa', description: 'Crispy golden potato & peas samosa (1 pc)', price: 15, categoryId: categories['snacks'], counterId: counters['SNK'], sortOrder: 0 },
    { name: 'Bajji', description: 'Hot onion & mirchi bajji (2 pcs)', price: 12, categoryId: categories['snacks'], counterId: counters['SNK'], sortOrder: 1 },
    { name: 'Vada', description: 'Crispy South Indian medu vada (1 pc)', price: 12, categoryId: categories['snacks'], counterId: counters['SNK'], sortOrder: 2 },
    { name: 'Veg Puff', description: 'Flaky baked vegetable puff', price: 20, categoryId: categories['snacks'], counterId: counters['SNK'], sortOrder: 3 },
    { name: 'Banana Chips', description: 'Crispy salted Kerala raw banana chips (100g pack)', price: 25, categoryId: categories['snacks'], counterId: counters['SNK'], sortOrder: 4 },
    { name: 'Masala Vada', description: 'Crunchy spiced chana dal patties (2 pcs)', price: 15, categoryId: categories['snacks'], counterId: counters['SNK'], sortOrder: 5 },

    // --- Juices ---
    { name: 'Lime Juice', description: 'Freshly squeezed lime juice with mint', price: 30, categoryId: categories['juices'], counterId: counters['JIC'], sortOrder: 0 },
    { name: 'Orange Juice', description: 'Pure sweet fresh orange juice', price: 50, categoryId: categories['juices'], counterId: counters['JIC'], sortOrder: 1 },
    { name: 'Watermelon Juice', description: 'Hydrating fresh watermelon juice', price: 45, categoryId: categories['juices'], counterId: counters['JIC'], sortOrder: 2 },
    { name: 'Mango Juice', description: 'Thick seasonal Alphonso mango juice', price: 55, categoryId: categories['juices'], counterId: counters['JIC'], sortOrder: 3 },
    { name: 'Pineapple Juice', description: 'Sweet and tangy fresh pineapple juice', price: 50, categoryId: categories['juices'], counterId: counters['JIC'], sortOrder: 4 },

    // --- Cakes ---
    { name: 'Chocolate Cake', description: 'Rich Belgian chocolate fudge pastry slice', price: 80, categoryId: categories['cakes'], counterId: counters['JIC'], sortOrder: 0 },
    { name: 'Black Forest Cake', description: 'Layered cherry and chocolate cream pastry slice', price: 90, categoryId: categories['cakes'], counterId: counters['JIC'], sortOrder: 1 },
    { name: 'Plum Cake', description: 'Traditional fruit and nut cake slice', price: 60, categoryId: categories['cakes'], counterId: counters['SNK'], sortOrder: 2 },

    // --- Ice Creams ---
    { name: 'Vanilla', description: 'Creamy Madagascar vanilla bean ice cream scoop', price: 40, categoryId: categories['ice-creams'], counterId: counters['JIC'], sortOrder: 0 },
    { name: 'Chocolate', description: 'Rich dark chocolate ice cream scoop', price: 50, categoryId: categories['ice-creams'], counterId: counters['JIC'], sortOrder: 1 },
    { name: 'Butterscotch', description: 'Caramel crunch butterscotch scoop', price: 50, categoryId: categories['ice-creams'], counterId: counters['JIC'], sortOrder: 2 },
    { name: 'Kulfi', description: 'Traditional slow-cooked malai kulfi stick', price: 45, categoryId: categories['ice-creams'], counterId: counters['JIC'], sortOrder: 3 },

    // --- Food ---
    { name: 'Veg Sandwich', description: 'Toasted sandwich with cucumber, tomato and potato', price: 60, categoryId: categories['food'], counterId: counters['FOOD'], sortOrder: 0 },
    { name: 'Paneer Sandwich', description: 'Spiced paneer filling in toasted golden bread', price: 80, categoryId: categories['food'], counterId: counters['FOOD'], sortOrder: 1 },
    { name: 'Maggi', description: 'Classic masala noodles cooked with butter & veggies', price: 45, categoryId: categories['food'], counterId: counters['FOOD'], sortOrder: 2 },
    { name: 'Bread Omelette', description: 'Double egg fluffy masala omelette wrapped in bread', price: 40, categoryId: categories['food'], counterId: counters['FOOD'], sortOrder: 3 },
    { name: 'Cheese Maggi', description: 'Cheesy masala Maggi topped with melted mozzarella', price: 60, categoryId: categories['food'], counterId: counters['FOOD'], sortOrder: 4 },

    // --- Cool Drinks ---
    { name: 'Coke', description: 'Chilled Coca-Cola can (300ml)', price: 40, categoryId: categories['cool-drinks'], counterId: counters['JIC'], sortOrder: 0 },
    { name: 'Sprite', description: 'Chilled Sprite can (300ml)', price: 40, categoryId: categories['cool-drinks'], counterId: counters['JIC'], sortOrder: 1 },
    { name: 'Thums Up', description: 'Chilled Thums Up bottle (250ml)', price: 40, categoryId: categories['cool-drinks'], counterId: counters['JIC'], sortOrder: 2 },

    // --- Bakery ---
    { name: 'Bread', description: 'Fresh whole wheat sliced loaf (400g)', price: 40, categoryId: categories['bakery'], counterId: counters['SNK'], sortOrder: 0 },
    { name: 'Bun', description: 'Soft sweet bakery bun (1 pc)', price: 20, categoryId: categories['bakery'], counterId: counters['SNK'], sortOrder: 1 },
    { name: 'Butter Bun', description: 'Soft bun with creamy butter and sugar filling', price: 25, categoryId: categories['bakery'], counterId: counters['SNK'], sortOrder: 2 },

    // --- Other ---
    { name: 'Mineral Water', description: 'Packaged drinking water bottle (1L)', price: 20, categoryId: categories['other'], counterId: counters['SNK'], sortOrder: 0 },
    { name: 'Butter Biscuit', description: 'Crispy fresh butter bakery biscuits (4 pcs)', price: 10, categoryId: categories['other'], counterId: counters['SNK'], sortOrder: 1 },
  ];

  for (const p of products) {
    const existing = await prisma.product.findFirst({
      where: { shopId: shop.id, name: p.name },
    });
    if (!existing) {
      await prisma.product.create({
        data: { shopId: shop.id, ...p, availability: 'AVAILABLE', maxQuantity: 20 },
      });
      console.log(`✅ Created Product: ${p.name}`);
    }
  }

  // ---- Users & Staff ----
  const users = [
    { email: 'admin@queueless.local', name: 'QueueLess Admin', role: 'OWNER' },
    { email: 'owner@srilakshmi.com', name: 'Lakshmi', role: 'OWNER' },
    { email: 'billing@srilakshmi.com', name: 'Ravi (Billing)', role: 'BILLING' },
    { email: 'tea@srilakshmi.com', name: 'Kumar (Tea)', role: 'COUNTER_STAFF', counterId: counters['TEA'] },
    { email: 'snacks@srilakshmi.com', name: 'Priya (Snacks)', role: 'COUNTER_STAFF', counterId: counters['SNK'] },
  ];

  for (const u of users) {
    let user = await prisma.user.findUnique({ where: { email: u.email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: u.email,
          name: u.name,
          passwordHash: hashPassword('QueueLess@123'),
        },
      });
      console.log(`✅ Created User: ${u.email}`);
    }

    const membership = await prisma.staffMembership.findUnique({
      where: { userId_shopId: { userId: user.id, shopId: shop.id } },
    });
    if (!membership) {
      await prisma.staffMembership.create({
        data: {
          userId: user.id,
          shopId: shop.id,
          role: u.role,
          counterId: u.counterId || null,
        },
      });
      console.log(`✅ Created Membership: ${u.email} -> ${u.role}`);
    }
  }

  console.log('\n🎉 Production Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
