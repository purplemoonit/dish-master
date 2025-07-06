import { Test, TestingModule } from '@nestjs/testing';
import { IngredientsController } from './ingredients.controller';
import { IngredientsService } from './ingredients.service';

describe('IngredientsController', () => {
  let controller: IngredientsController;
  let service: IngredientsService;

  const mockIngredient = {
    id: 'uuid-1',
    name: 'Tomato',
    image: 'url',
    createdAt: new Date(),
    updatedAt: new Date(),
    category: 'Vegetables',
    isActive: true,
  };

  const ingredientsArray = [mockIngredient];

  const mockIngredientsService = {
    findActive: jest.fn().mockResolvedValue(ingredientsArray),
    findAllWithInactive: jest.fn().mockResolvedValue(ingredientsArray),
    findByCategory: jest
      .fn()
      .mockImplementation((category: string) =>
        Promise.resolve(
          ingredientsArray.filter((i) => i.category === category),
        ),
      ),
    findOne: jest
      .fn()
      .mockImplementation((id: string) =>
        Promise.resolve(id === mockIngredient.id ? mockIngredient : null),
      ),
    create: jest
      .fn()
      .mockImplementation((dto) => Promise.resolve({ id: 'new-uuid', ...dto })),
    update: jest
      .fn()
      .mockImplementation((id, dto) => Promise.resolve({ id, ...dto })),
    remove: jest
      .fn()
      .mockResolvedValue({ message: 'Ingredient deleted successfully' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngredientsController],
      providers: [
        { provide: IngredientsService, useValue: mockIngredientsService },
      ],
    }).compile();

    controller = module.get<IngredientsController>(IngredientsController);
    service = module.get<IngredientsService>(IngredientsService);
  });

  describe('findAll', () => {
    it('should return all ingredients if no category is provided', async () => {
      const result = await controller.findActive();
      expect(service.findActive).toHaveBeenCalled();
      expect(result).toEqual(ingredientsArray);
    });

    it('should return active and inactive for ROOT and CONTRIBUTOR user ingredients if no category is provided', async () => {
      const result = await controller.findAllWithInactive();
      expect(service.findAllWithInactive).toHaveBeenCalled();
      expect(result).toEqual(ingredientsArray);
    });

    it('should return filtered ingredients if category is provided', async () => {
      const category = 'Vegetables';
      const result = await controller.findActive(category);
      expect(service.findByCategory).toHaveBeenCalledWith(category);
      expect(result.every((i) => i.category === category)).toBe(true);
    });
  });

  describe('findOne', () => {
    it('should return one ingredient by id', async () => {
      const id = mockIngredient.id;
      const result = await controller.findOne(id);
      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockIngredient);
    });

    it('should return null or throw if ingredient not found', async () => {
      const id = 'non-existent-id';
      const result = await controller.findOne(id);
      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create and return a new ingredient', async () => {
      const dto = {
        name: 'Cucumber',
        image: 'url-cucumber',
        category: 'Vegetables',
        isActive: true,
      };
      const result = await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expect.objectContaining(dto));
    });
  });

  describe('update', () => {
    it('should update and return the ingredient', async () => {
      const id = mockIngredient.id;
      const dto = { name: 'Updated Tomato' };
      const result = await controller.update(id, dto);
      expect(service.update).toHaveBeenCalledWith(id, dto);
      expect(result).toEqual(expect.objectContaining({ id, ...dto }));
    });
  });

  describe('remove', () => {
    it('should delete the ingredient and return message', async () => {
      const id = mockIngredient.id;
      const result = await controller.remove(id);
      expect(service.remove).toHaveBeenCalledWith(id);
      expect(result).toEqual({ message: 'Ingredient deleted successfully' });
    });
  });
});
