import { Test, TestingModule } from '@nestjs/testing';
import { KitchenTipsService } from './kitchen-tips.service';
import { PrismaService } from '../../prisma/prisma.service';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateKitchenTipDto } from './dto/create-kitchen-tip.dto';
import { UpdateKitchenTipDto } from './dto/update-kitchen-tip.dto';

describe('KitchenTipsService', () => {
  let service: KitchenTipsService;
  let prisma: {
    kitchenTip: {
      create: jest.Mock;
      findMany: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      kitchenTip: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KitchenTipsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<KitchenTipsService>(KitchenTipsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create and return a kitchen tip', async () => {
      const dto: CreateKitchenTipDto = {
        title: 'Tip title',
        description: 'Tip description',
        image: 'image.png',
        videoUrl: 'video.mp4',
        tags: ['tag1', 'tag2'],
      };
      const created = { id: '1', ...dto };
      prisma.kitchenTip.create.mockResolvedValue(created);

      await expect(service.create(dto)).resolves.toEqual(created);
      expect(prisma.kitchenTip.create).toHaveBeenCalledWith({ data: dto });
    });

    it('should throw InternalServerErrorException on failure', async () => {
      prisma.kitchenTip.create.mockRejectedValue(new Error('fail'));
      await expect(service.create({} as any)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findAll', () => {
    it('should return array of kitchen tips', async () => {
      const tips = [
        { id: '1', title: 'Tip 1' },
        { id: '2', title: 'Tip 2' },
      ];
      prisma.kitchenTip.findMany.mockResolvedValue(tips);

      await expect(service.findAll()).resolves.toEqual(tips);
      expect(prisma.kitchenTip.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should throw InternalServerErrorException on failure', async () => {
      prisma.kitchenTip.findMany.mockRejectedValue(new Error('fail'));
      await expect(service.findAll()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findOne', () => {
    it('should return the kitchen tip if found', async () => {
      const tip = { id: '1', title: 'Tip 1' };
      prisma.kitchenTip.findUnique.mockResolvedValue(tip);

      await expect(service.findOne('1')).resolves.toEqual(tip);
      expect(prisma.kitchenTip.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should throw NotFoundException if not found', async () => {
      prisma.kitchenTip.findUnique.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException on other errors', async () => {
      prisma.kitchenTip.findUnique.mockRejectedValue(new Error('fail'));

      await expect(service.findOne('1')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('update', () => {
    const dto: UpdateKitchenTipDto = { title: 'Updated title' };

    it('should update and return the updated kitchen tip', async () => {
      prisma.kitchenTip.findUnique.mockResolvedValue({ id: '1' });
      const updated = { id: '1', ...dto };
      prisma.kitchenTip.update.mockResolvedValue(updated);

      await expect(service.update('1', dto)).resolves.toEqual(updated);
      expect(prisma.kitchenTip.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(prisma.kitchenTip.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: dto,
      });
    });

    it('should throw NotFoundException if tip does not exist', async () => {
      prisma.kitchenTip.findUnique.mockResolvedValue(null);

      await expect(service.update('1', dto)).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException on other errors', async () => {
      prisma.kitchenTip.findUnique.mockResolvedValue({ id: '1' });
      prisma.kitchenTip.update.mockRejectedValue(new Error('fail'));

      await expect(service.update('1', dto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('remove', () => {
    it('should remove and return deleted kitchen tip', async () => {
      prisma.kitchenTip.findUnique.mockResolvedValue({ id: '1' });
      prisma.kitchenTip.delete.mockResolvedValue({ id: '1' });

      await expect(service.remove('1')).resolves.toEqual({ id: '1' });
      expect(prisma.kitchenTip.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(prisma.kitchenTip.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should throw NotFoundException if tip does not exist', async () => {
      prisma.kitchenTip.findUnique.mockResolvedValue(null);

      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException on other errors', async () => {
      prisma.kitchenTip.findUnique.mockResolvedValue({ id: '1' });
      prisma.kitchenTip.delete.mockRejectedValue(new Error('fail'));

      await expect(service.remove('1')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('filterByTag', () => {
    it('should return tips filtered by tag', async () => {
      const tag = 'storage';
      const tips = [
        { id: '1', tags: [tag] },
        { id: '2', tags: [tag] },
      ];
      prisma.kitchenTip.findMany.mockResolvedValue(tips);

      await expect(service.filterByTag(tag)).resolves.toEqual(tips);
      expect(prisma.kitchenTip.findMany).toHaveBeenCalledWith({
        where: { tags: { has: tag } },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should throw InternalServerErrorException on failure', async () => {
      prisma.kitchenTip.findMany.mockRejectedValue(new Error('fail'));
      await expect(service.filterByTag('tag')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('search', () => {
    it('should return tips matching the query', async () => {
      const query = 'knife';
      const tips = [
        { id: '1', title: 'Knife tip' },
        { id: '2', description: 'Use a sharp knife' },
      ];
      prisma.kitchenTip.findMany.mockResolvedValue(tips);

      await expect(service.search(query)).resolves.toEqual(tips);
      expect(prisma.kitchenTip.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should throw InternalServerErrorException on failure', async () => {
      prisma.kitchenTip.findMany.mockRejectedValue(new Error('fail'));
      await expect(service.search('query')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
