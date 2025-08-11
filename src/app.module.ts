import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './modules/user/users.module';
import { RecipesModule } from './modules/recipe/recipes.module';
import { IngredientsModule } from './modules/ingredients/ingredients.module';
import { AuthModule } from './modules/user/auth/auth.module';
import { CookingTipsModule } from './modules/cooking-tips/cooking-tips.module';
import { KitchenTipsModule } from './modules/kitchen-tips/kitchen-tips.module';
import { RegionModule } from './modules/region/region.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    RecipesModule,
    IngredientsModule,
    AuthModule,
    CookingTipsModule,
    KitchenTipsModule,
    RegionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
