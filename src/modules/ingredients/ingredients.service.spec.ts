import { Test, TestingModule } from '@nestjs/testing';
import { IngredientsService } from './ingredients.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';

describe('IngredientsService', () => {
  let service: IngredientsService;
  let prisma: {
    ingredient: {
      create: jest.Mock;
      findMany: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      ingredient: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngredientsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<IngredientsService>(IngredientsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new ingredient', async () => {
      const dto: CreateIngredientDto = {
        name: 'Tomato',
        image: 'https://example.com/tomato.jpg',
        category: 'Vegetable',
        isActive: true,
      };
      const created = { id: 'uuid', ...dto };

      prisma.ingredient.create.mockResolvedValue(created);

      await expect(service.create(dto)).resolves.toEqual(created);
      expect(prisma.ingredient.create).toHaveBeenCalledWith({
        data: dto,
      });
    });
  });

  describe('findActive', () => {
    it('should return only active ingredients', async () => {
      const ingredients = [
        {
          id: '1',
          name: 'Tomato',
          isActive: true,
          image: 'https://example.com/tomato.jpg',
          category: 'Vegetable',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      prisma.ingredient.findMany.mockResolvedValue(ingredients);

      await expect(service.findActive()).resolves.toEqual(ingredients);
      expect(prisma.ingredient.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        orderBy: { name: 'asc' },
        select: expect.any(Object),
      });
    });
  });

  describe('findAllWithInactive', () => {
    it('should return all ingredients including inactive', async () => {
      const ingredients = [
        { id: '1', name: 'Tomato', isActive: true },
        { id: '2', name: 'Onion', isActive: false },
      ];
      prisma.ingredient.findMany.mockResolvedValue(ingredients);

      await expect(service.findAllWithInactive()).resolves.toEqual(ingredients);
      expect(prisma.ingredient.findMany).toHaveBeenCalledWith({
        orderBy: { name: 'asc' },
        select: expect.any(Object),
      });
    });
  });

  describe('findByCategory', () => {
    it('should return ingredients by category', async () => {
      const result = [
        { id: '1', name: 'Tomato', category: 'Vegetable', isActive: true },
      ];
      prisma.ingredient.findMany.mockResolvedValue(result);

      await expect(service.findByCategory('Vegetable')).resolves.toEqual(
        result,
      );
      expect(prisma.ingredient.findMany).toHaveBeenCalledWith({
        where: { category: 'Vegetable', isActive: true },
        orderBy: { name: 'asc' },
        select: expect.any(Object),
      });
    });
  });

  describe('findOne', () => {
    it('should return one ingredient', async () => {
      const ingredient = {
        id: '1',
        name: 'Tomato',
        isActive: true,
      };
      prisma.ingredient.findUnique.mockResolvedValue(ingredient);

      await expect(service.findOne('1')).resolves.toEqual(ingredient);
      expect(prisma.ingredient.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should throw NotFoundException if ingredient not found', async () => {
      prisma.ingredient.findUnique.mockResolvedValue(null);

      await expect(service.findOne('invalid')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if ingredient is inactive', async () => {
      prisma.ingredient.findUnique.mockResolvedValue({
        id: '1',
        name: 'x',
        isActive: false,
      });

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an ingredient', async () => {
      const dto: UpdateIngredientDto = { name: 'Updated Tomato' };
      prisma.ingredient.findUnique.mockResolvedValue({
        id: '1',
        isActive: true,
      });
      prisma.ingredient.update.mockResolvedValue({ id: '1', ...dto });

      await expect(service.update('1', dto)).resolves.toEqual({
        id: '1',
        ...dto,
      });

      expect(prisma.ingredient.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          name: 'Updated Tomato',
          image: undefined,
          category: undefined,
          isActive: undefined,
        },
      });
    });

    it('should throw NotFoundException if ingredient not found', async () => {
      prisma.ingredient.findUnique.mockResolvedValue(null);

      await expect(service.update('x', { name: 'y' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete an ingredient', async () => {
      prisma.ingredient.findUnique.mockResolvedValue({
        id: '1',
        isActive: true,
      });
      prisma.ingredient.delete.mockResolvedValue({ id: '1' });

      await expect(service.remove('1')).resolves.toEqual({ id: '1' });
      expect(prisma.ingredient.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should throw NotFoundException if ingredient not found', async () => {
      prisma.ingredient.findUnique.mockResolvedValue(null);

      await expect(service.remove('x')).rejects.toThrow(NotFoundException);
    });
  });
});
