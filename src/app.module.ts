import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { RecipesModule } from './modules/recipes/recipes.module';
import { IngredientsModule } from './modules/ingredients/ingredients.module';
import { AuthModule } from './modules/users/auth/auth.module';
import { CookingTipsModule } from './modules/cooking-tips/cooking-tips.module';
import { KitchenTipsModule } from './modules/kitchen-tips/kitchen-tips.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    RecipesModule,
    IngredientsModule,
    AuthModule,
    CookingTipsModule,
    KitchenTipsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
