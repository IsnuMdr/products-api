import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Seed Categories
  const electronics = await prisma.category.upsert({
    where: { name: 'Electronics' },
    update: {},
    create: {
      name: 'Electronics',
    },
  });

  const clothing = await prisma.category.upsert({
    where: { name: 'Clothing' },
    update: {},
    create: {
      name: 'Clothing',
    },
  });

  const books = await prisma.category.upsert({
    where: { name: 'Books' },
    update: {},
    create: {
      name: 'Books',
    },
  });

  console.log('✅ Categories seeded');

  // Seed Products
  await prisma.product.upsert({
    where: { sku: 'ELEC-001' },
    update: {},
    create: {
      sku: 'ELEC-001',
      name: 'Laptop Dell XPS 15',
      price: 25000000,
      stock: 10,
      categoryId: electronics.id,
    },
  });

  await prisma.product.upsert({
    where: { sku: 'ELEC-002' },
    update: {},
    create: {
      sku: 'ELEC-002',
      name: 'iPhone 15 Pro Max',
      price: 20000000,
      stock: 15,
      categoryId: electronics.id,
    },
  });

  await prisma.product.upsert({
    where: { sku: 'CLTH-001' },
    update: {},
    create: {
      sku: 'CLTH-001',
      name: 'Kemeja Batik Premium',
      price: 350000,
      stock: 50,
      categoryId: clothing.id,
    },
  });

  await prisma.product.upsert({
    where: { sku: 'BOOK-001' },
    update: {},
    create: {
      sku: 'BOOK-001',
      name: 'Clean Code by Robert Martin',
      price: 450000,
      stock: 25,
      categoryId: books.id,
    },
  });

  console.log('✅ Products seeded');
  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });