import { Module } from '@nestjs/common';
import { CookingTipsService } from './cooking-tips.service';
import { CookingTipsController } from './cooking-tips.controller';

@Module({
  providers: [CookingTipsService],
  controllers: [CookingTipsController]
})
export class CookingTipsModule {}
