import { Test, TestingModule } from '@nestjs/testing';
import { CookingTipsController } from './cooking-tips.controller';
import { CookingTipsService } from './cooking-tips.service';
import { Role } from '@prisma/client';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('CookingTipsController', () => {
  let controller: CookingTipsController;
  let service: Partial<Record<keyof CookingTipsService, jest.Mock>>;

  beforeEach(async () => {
    service = {
      findAll: jest.fn(),
      findByRecipe: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CookingTipsController],
      providers: [{ provide: CookingTipsService, useValue: service }],
    }).compile();

    controller = module.get<CookingTipsController>(CookingTipsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all cooking tips if no recipeId is provided', async () => {
      const mockTips = [
        { id: '1', title: 'Tip1' },
        { id: '2', title: 'Tip2' },
      ];
      service.findAll.mockResolvedValue(mockTips);

      await expect(controller.findAll()).resolves.toEqual(mockTips);
      expect(service.findAll).toHaveBeenCalled();
      expect(service.findByRecipe).not.toHaveBeenCalled();
    });

    it('should return cooking tips filtered by recipeId', async () => {
      const recipeId = 'recipe-uuid';
      const mockTips = [{ id: '1', title: 'Tip1', recipeId }];
      service.findByRecipe.mockResolvedValue(mockTips);

      await expect(controller.findAll(recipeId)).resolves.toEqual(mockTips);
      expect(service.findByRecipe).toHaveBeenCalledWith(recipeId);
      expect(service.findAll).not.toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a cooking tip by id', async () => {
      const tipId = 'tip-uuid';
      const mockTip = { id: tipId, title: 'Tip1' };
      service.findOne.mockResolvedValue(mockTip);

      await expect(controller.findOne(tipId)).resolves.toEqual(mockTip);
      expect(service.findOne).toHaveBeenCalledWith(tipId);
    });

    it('should throw NotFoundException if tip not found', async () => {
      const tipId = 'missing-id';
      service.findOne.mockRejectedValue(new NotFoundException());

      await expect(controller.findOne(tipId)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.findOne).toHaveBeenCalledWith(tipId);
    });
  });

  describe('create', () => {
    it('should create and return a new cooking tip', async () => {
      const dto = {
        title: 'New Tip',
        description: 'Description',
        recipeId: 'r1',
      };
      const createdTip = { id: 'new-id', ...dto };
      service.create.mockResolvedValue(createdTip);

      await expect(controller.create(dto)).resolves.toEqual(createdTip);
      expect(service.create).toHaveBeenCalledWith(dto);
    });

    it('should throw ForbiddenException on access denied', async () => {
      const dto = {
        title: 'New Tip',
        description: 'Description',
        recipeId: 'r1',
      };
      service.create.mockRejectedValue(new ForbiddenException());

      await expect(controller.create(dto)).rejects.toThrow(ForbiddenException);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should update and return the cooking tip', async () => {
      const tipId = 'tip-uuid';
      const dto = { title: 'Updated Title' };
      const updatedTip = { id: tipId, ...dto };
      service.update.mockResolvedValue(updatedTip);

      await expect(controller.update(tipId, dto)).resolves.toEqual(updatedTip);
      expect(service.update).toHaveBeenCalledWith(tipId, dto);
    });

    it('should throw NotFoundException if tip to update not found', async () => {
      const tipId = 'missing-id';
      const dto = { title: 'Updated Title' };
      service.update.mockRejectedValue(new NotFoundException());

      await expect(controller.update(tipId, dto)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.update).toHaveBeenCalledWith(tipId, dto);
    });

    it('should throw ForbiddenException on access denied', async () => {
      const tipId = 'tip-uuid';
      const dto = { title: 'Updated Title' };
      service.update.mockRejectedValue(new ForbiddenException());

      await expect(controller.update(tipId, dto)).rejects.toThrow(
        ForbiddenException,
      );
      expect(service.update).toHaveBeenCalledWith(tipId, dto);
    });
  });

  describe('remove', () => {
    it('should remove and return the deleted cooking tip', async () => {
      const tipId = 'tip-uuid';
      const deletedTip = { id: tipId, title: 'Deleted Tip' };
      service.remove.mockResolvedValue(deletedTip);

      await expect(controller.remove(tipId)).resolves.toEqual(deletedTip);
      expect(service.remove).toHaveBeenCalledWith(tipId);
    });

    it('should throw NotFoundException if tip to delete not found', async () => {
      const tipId = 'missing-id';
      service.remove.mockRejectedValue(new NotFoundException());

      await expect(controller.remove(tipId)).rejects.toThrow(NotFoundException);
      expect(service.remove).toHaveBeenCalledWith(tipId);
    });

    it('should throw ForbiddenException on access denied', async () => {
      const tipId = 'tip-uuid';
      service.remove.mockRejectedValue(new ForbiddenException());

      await expect(controller.remove(tipId)).rejects.toThrow(
        ForbiddenException,
      );
      expect(service.remove).toHaveBeenCalledWith(tipId);
    });
  });
});
