import { Test, TestingModule } from '@nestjs/testing';
import { KitchenTipsService } from './kitchen-tips.service';

describe('KitchenTipsService', () => {
  let service: KitchenTipsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KitchenTipsService],
    }).compile();

    service = module.get<KitchenTipsService>(KitchenTipsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
