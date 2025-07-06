import { Test, TestingModule } from '@nestjs/testing';
import { KitchenTipsController } from './kitchen-tips.controller';
import { KitchenTipsService } from './kitchen-tips.service';
import { NotFoundException } from '@nestjs/common';
import { CreateKitchenTipDto } from './dto/create-kitchen-tip.dto';
import { UpdateKitchenTipDto } from './dto/update-kitchen-tip.dto';

describe('KitchenTipsController', () => {
  let controller: KitchenTipsController;
  let service: jest.Mocked<KitchenTipsService>;

  const mockService = {
    findAll: jest.fn(),
    filterByTag: jest.fn(),
    search: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const result = [
    {
      id: 'uuid',
      title: 'Keep knives sharp',
      description: 'Always sharpen your knives before use.',
      image: null,
      videoUrl: null,
      tags: ['safety', 'knives'],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KitchenTipsController],
      providers: [
        {
          provide: KitchenTipsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<KitchenTipsController>(KitchenTipsController);
    service = module.get(KitchenTipsService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('findAll', () => {
    it('should return all tips', async () => {
      service.findAll.mockResolvedValue(result);
      expect(await controller.findAll()).toEqual(result);
    });

    it('should filter by tag if tag is provided', async () => {
      service.filterByTag.mockResolvedValue(result);
      expect(await controller.findAll('storage')).toEqual(result);
    });

    it('should search by keyword if q is provided', async () => {
      service.search.mockResolvedValue(result);
      expect(await controller.findAll(undefined, 'knife')).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return a kitchen tip by id', async () => {
      service.findOne.mockResolvedValue(result[0]);
      expect(await controller.findOne('1')).toEqual(result[0]);
    });

    it('should throw NotFoundException if tip not found', async () => {
      service.findOne.mockResolvedValue(null);
      await expect(controller.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and return a new tip', async () => {
      const dto: CreateKitchenTipDto = {
        title: 'Open jars safely',
        description: 'Use a spoon...',
        tags: ['safety'],
      };
      service.create.mockResolvedValue(result[0]);
      expect(await controller.create(dto)).toEqual(result[0]);
    });
  });

  describe('update', () => {
    it('should update and return the tip', async () => {
      const dto: UpdateKitchenTipDto = { title: 'Updated title' };
      service.update.mockResolvedValue(result[0]);
      expect(await controller.update('1', dto)).toEqual(result[0]);
    });
  });

  describe('remove', () => {
    it('should delete and return the tip', async () => {
      service.remove.mockResolvedValue(result[0]);
      expect(await controller.remove('1')).toEqual(result[0]);
    });
  });
});
