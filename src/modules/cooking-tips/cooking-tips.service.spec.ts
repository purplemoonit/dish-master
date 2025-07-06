import { Test, TestingModule } from '@nestjs/testing';
import { CookingTipsController } from './cooking-tips.controller';
import { CookingTipsService } from './cooking-tips.service';
import { CreateCookingTipDto } from './dto/create-cooking-tip.dto';
import { UpdateCookingTipDto } from './dto/update-cooking-tip.dto';
import { NotFoundException } from '@nestjs/common';

describe('CookingTipsController', () => {
  let controller: CookingTipsController;
  let service: CookingTipsService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CookingTipsController],
      providers: [
        {
          provide: CookingTipsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<CookingTipsController>(CookingTipsController);
    service = module.get<CookingTipsService>(CookingTipsService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('should create a new cooking tip', async () => {
      const dto: CreateCookingTipDto = {
        title: 'Use fresh eggs',
        description: 'Fresh eggs result in a smoother texture.',
        recipeId: 'recipe-123',
      };

      const result = { id: 'tip-1', ...dto };
      mockService.create.mockResolvedValue(result);

      await expect(controller.create(dto)).resolves.toEqual(result);
      expect(mockService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return a list of cooking tips', async () => {
      const tips = [
        {
          id: 'tip-1',
          title: 'Use fresh eggs',
          description: 'Fresh eggs result in a smoother texture.',
          recipeId: 'recipe-123',
        },
      ];

      mockService.findAll.mockResolvedValue(tips);

      await expect(controller.findAll()).resolves.toEqual(tips);
      expect(mockService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single cooking tip', async () => {
      const tip = {
        id: 'tip-1',
        title: 'Use fresh eggs',
        description: 'Fresh eggs result in a smoother texture.',
        recipeId: 'recipe-123',
      };

      mockService.findOne.mockResolvedValue(tip);

      await expect(controller.findOne('tip-1')).resolves.toEqual(tip);
      expect(mockService.findOne).toHaveBeenCalledWith('tip-1');
    });

    it('should throw NotFoundException if tip not found', async () => {
      mockService.findOne.mockRejectedValue(new NotFoundException());

      await expect(controller.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update the cooking tip', async () => {
      const dto: UpdateCookingTipDto = {
        title: 'Use very fresh eggs',
      };
      const updated = {
        id: 'tip-1',
        title: 'Use very fresh eggs',
        description: 'Fresh eggs result in a smoother texture.',
        recipeId: 'recipe-123',
      };

      mockService.update.mockResolvedValue(updated);

      await expect(controller.update('tip-1', dto)).resolves.toEqual(updated);
      expect(mockService.update).toHaveBeenCalledWith('tip-1', dto);
    });

    it('should throw NotFoundException if tip not found', async () => {
      mockService.update.mockRejectedValue(new NotFoundException());

      await expect(
        controller.update('invalid-id', { title: 'x' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete the cooking tip', async () => {
      const deleted = { id: 'tip-1' };
      mockService.remove.mockResolvedValue(deleted);

      await expect(controller.remove('tip-1')).resolves.toEqual(deleted);
      expect(mockService.remove).toHaveBeenCalledWith('tip-1');
    });

    it('should throw NotFoundException if tip not found', async () => {
      mockService.remove.mockRejectedValue(new NotFoundException());

      await expect(controller.remove('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
