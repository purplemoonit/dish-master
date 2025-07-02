import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
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
    { name: 'Tomato', image: 'https://example.com/ingredients/tomato.png' },
    { name: 'Basil', image: 'https://example.com/ingredients/basil.png' },
    { name: 'Chicken', image: 'https://example.com/ingredients/chicken.png' },
  ];

  for (const ingredient of ingredients) {
    await prisma.ingredient.upsert({
      where: { name: ingredient.name },
      update: {},
      create: ingredient,
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
