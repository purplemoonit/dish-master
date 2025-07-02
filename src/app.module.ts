import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { RecipesModule } from './modules/recipes/recipes.module';
import { IngredientsModule } from './modules/ingredients/ingredients.module';

@Module({
  imports: [PrismaModule, UsersModule, RecipesModule, IngredientsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
