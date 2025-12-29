import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import { ApiKeyGuard } from './common/api-key.guard';
// import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Dish-Master API')
    .setDescription('Recipe API with API-Key + JWT Auth')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // const prisma = app.get(PrismaService);

  // app.useGlobalGuards(new ApiKeyGuard(prisma));

  await app.listen(3000);
}
bootstrap();
