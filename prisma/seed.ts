import { PrismaClient, Role } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  // 🌍 Regions
  const filePath = path.join(
    __dirname,
    'seed-data',
    'countries-flag-json.json',
  );
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  for (const region of data) {
    await prisma.region.upsert({
      where: { title: region.title },
      update: {},
      create: {
        title: region.title,
        flagImage: region.flagImage,
      },
    });
  }

  console.log('✅ Seeded regions with flags');
  // 👤 Users
  await prisma.user.upsert({
    where: { email: 'root@example.com' },
    update: {},
    create: {
      email: 'root@example.com',
      password: 'hashed_root_password', // replace with actual hash
      apiKey: 'root-api-key-123',
      role: Role.ROOT,
    },
  });

  await prisma.user.upsert({
    where: { email: 'viewer@example.com' },
    update: {},
    create: {
      email: 'viewer@example.com',
      password: 'hashed_viewer_password',
      apiKey: 'viewer-api-key-456',
      role: Role.VIEWER,
    },
  });

  // 🌍 Regions
  const regions = [
    { title: 'Italian', flagImage: 'https://example.com/flags/italy.png' },
    { title: 'Japanese', flagImage: 'https://example.com/flags/japan.png' },
    { title: 'Georgian', flagImage: 'https://example.com/flags/georgia.png' },
  ];

  for (const region of regions) {
    await prisma.region.upsert({
      where: { title: region.title },
      update: {},
      create: region,
    });
  }

  // 🥦 Ingredients
  const ingredients = [
    {
      name: 'Tomato',
      image: 'https://example.com/images/tomato.png',
      category: 'Vegetables',
      isActive: true,
    },
    {
      name: 'Basil',
      image: 'https://example.com/images/basil.png',
      category: 'Herbs',
      isActive: true,
    },
    {
      name: 'Olive Oil',
      image: 'https://example.com/images/olive-oil.png',
      category: 'Oils',
      isActive: true,
    },
  ];

  for (const ingredient of ingredients) {
    await prisma.ingredient.upsert({
      where: { name: ingredient.name },
      update: {},
      create: {
        name: ingredient.name,
        image: ingredient.image,
        category: ingredient.category,
        isActive: ingredient.isActive,
      },
    });
  }

  console.log('✅ Seeded users, regions, and ingredients!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
