import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from '../users/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../users/auth/guards/roles.guard';
import { RegionController } from './region.controller';
import { RegionsService } from './region.service';

describe('RegionController', () => {
  let controller: RegionController;
  let service: RegionsService;

  const mockRegions = [
    { id: '1', title: 'Europe', flagImage: 'https://flags.example/eu.png' },
    { id: '2', title: 'Asia', flagImage: 'https://flags.example/asia.png' },
  ];

  const mockRegion = {
    id: '1',
    title: 'Europe',
    flagImage: 'https://flags.example/eu.png',
  };

  const mockService = {
    findAll: jest.fn().mockResolvedValue(mockRegions),
    create: jest
      .fn()
      .mockImplementation((dto) => Promise.resolve({ id: '3', ...dto })),
    update: jest
      .fn()
      .mockImplementation((id, dto) => Promise.resolve({ id, ...dto })),
    remove: jest.fn().mockResolvedValue({ id: '1' }),
  };

  // Mock guards to simply allow access (you can enhance them for auth testing)
  const mockJwtAuthGuard = {
    canActivate: jest.fn((context: ExecutionContext) => true),
  };
  const mockRolesGuard = {
    canActivate: jest.fn((context: ExecutionContext) => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegionController],
      providers: [
        { provide: RegionsService, useValue: mockService },
        Reflector,
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .overrideGuard(RolesGuard)
      .useValue(mockRolesGuard)
      .compile();

    controller = module.get<RegionController>(RegionController);
    service = module.get<RegionsService>(RegionsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all regions', async () => {
      await expect(controller.findAll()).resolves.toEqual(mockRegions);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a region', async () => {
      const dto = {
        title: 'Africa',
        flagImage: 'https://flags.example/africa.png',
      };
      await expect(controller.create(dto)).resolves.toEqual({
        id: '3',
        ...dto,
      });
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should update a region', async () => {
      const dto = {
        title: 'Updated Europe',
        flagImage: 'https://flags.example/eu-updated.png',
      };
      await expect(controller.update('1', dto)).resolves.toEqual({
        id: '1',
        ...dto,
      });
      expect(service.update).toHaveBeenCalledWith('1', dto);
    });
  });

  describe('remove', () => {
    it('should delete a region', async () => {
      await expect(controller.remove('1')).resolves.toEqual({ id: '1' });
      expect(service.remove).toHaveBeenCalledWith('1');
    });
  });
});
