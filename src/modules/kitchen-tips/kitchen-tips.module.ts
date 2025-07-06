import { Module } from '@nestjs/common';
import { KitchenTipsController } from './kitchen-tips.controller';
import { KitchenTipsService } from './kitchen-tips.service';

@Module({
  controllers: [KitchenTipsController],
  providers: [KitchenTipsService],
})
export class KitchenTipsModule {}
