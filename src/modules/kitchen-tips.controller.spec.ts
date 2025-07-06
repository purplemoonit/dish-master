import { Test, TestingModule } from '@nestjs/testing';
import { KitchenTipsController } from './kitchen-tips.controller';

describe('KitchenTipsController', () => {
  let controller: KitchenTipsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KitchenTipsController],
    }).compile();

    controller = module.get<KitchenTipsController>(KitchenTipsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
