import { Test, TestingModule } from '@nestjs/testing';
import { RegionsService } from './region.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';

describe('RegionsService', () => {
  let service: RegionsService;
  let prisma: {
    region: {
      create: jest.Mock;
      findMany: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      region: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [RegionsService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<RegionsService>(RegionsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new region', async () => {
      const dto: CreateRegionDto = {
        title: 'France',
        flagImage: 'https://flags/fr.png',
      };
      const created = { id: 'uuid', ...dto };

      prisma.region.create.mockResolvedValue(created);

      await expect(service.create(dto)).resolves.toEqual(created);
      expect(prisma.region.create).toHaveBeenCalledWith({ data: dto });
    });

    it('should throw ForbiddenException on error', async () => {
      prisma.region.create.mockRejectedValue(new Error('Some DB error'));
      await expect(
        service.create({ title: 'Duplicate', flagImage: '' }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('findAll', () => {
    it('should return all regions ordered by title', async () => {
      const result = [{ id: '1', title: 'France', flagImage: '' }];
      prisma.region.findMany.mockResolvedValue(result);

      await expect(service.findAll()).resolves.toEqual(result);
      expect(prisma.region.findMany).toHaveBeenCalledWith({
        orderBy: { title: 'asc' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a region by ID', async () => {
      const region = { id: '1', title: 'Italy', flagImage: '' };
      prisma.region.findUnique.mockResolvedValue(region);

      await expect(service.findOne('1')).resolves.toEqual(region);
    });

    it('should throw NotFoundException if region does not exist', async () => {
      prisma.region.findUnique.mockResolvedValue(null);
      await expect(service.findOne('missing')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update an existing region', async () => {
      const dto: UpdateRegionDto = { title: 'Spain', flagImage: '' };
      const existing = { id: '1', title: 'Old', flagImage: '' };
      const updated = { id: '1', ...dto };

      prisma.region.findUnique.mockResolvedValue(existing);
      prisma.region.update.mockResolvedValue(updated);

      await expect(service.update('1', dto)).resolves.toEqual(updated);
      expect(prisma.region.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: dto,
      });
    });

    it('should throw NotFoundException if region not found', async () => {
      prisma.region.findUnique.mockResolvedValue(null);
      await expect(
        service.update('missing', { title: 'x', flagImage: '' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a region', async () => {
      const region = { id: '1', title: 'UK', flagImage: '' };
      prisma.region.findUnique.mockResolvedValue(region);
      prisma.region.delete.mockResolvedValue(region);

      await expect(service.remove('1')).resolves.toEqual(region);
      expect(prisma.region.delete).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should throw NotFoundException if region not found', async () => {
      prisma.region.findUnique.mockResolvedValue(null);
      await expect(service.remove('missing')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
