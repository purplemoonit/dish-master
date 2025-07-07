import { Module } from '@nestjs/common';
import { RegionController } from './region.controller';
import { RegionsService } from './region.service';

@Module({
  controllers: [RegionController],
  providers: [RegionsService],
})
export class RegionModule {}
