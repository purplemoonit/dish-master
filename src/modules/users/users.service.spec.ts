import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('getUserById', () => {
    it('should return user if found', async () => {
      const user = { id: '1', email: 'test@test.com' };
      mockPrisma.user.findUnique.mockResolvedValue(user);
      const result = await service.getUserById('1');
      expect(result).toEqual(user);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        select: expect.any(Object),
      });
    });

    it('should throw if user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      await expect(service.getUserById('2')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [{ id: '1' }, { id: '2' }];
      mockPrisma.user.findMany.mockResolvedValue(users);
      const result = await service.findAll();
      expect(result).toEqual(users);
      expect(prisma.user.findMany).toHaveBeenCalledWith({
        select: expect.any(Object),
      });
    });
  });

  describe('regenerateApiKey', () => {
    it('should regenerate API key and return updated user', async () => {
      const updated = { id: '1', email: 'test@test.com', apiKey: 'new-key' };
      mockPrisma.user.update.mockResolvedValue(updated);
      const result = await service.regenerateApiKey('1');
      expect(result).toEqual({
        message: 'API key regenerated',
        apiKey: 'new-key',
      });
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { apiKey: expect.any(String) },
        select: expect.any(Object),
      });
    });
  });

  describe('updateUserRole', () => {
    it('should throw if user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      await expect(
        service.updateUserRole('1', Role.CONTRIBUTOR),
      ).rejects.toThrow(NotFoundException);
    });

    it('should update and return the user role', async () => {
      const user = { id: '1' };
      const updated = { id: '1', role: Role.CONTRIBUTOR };
      mockPrisma.user.findUnique.mockResolvedValue(user);
      mockPrisma.user.update.mockResolvedValue(updated);
      const result = await service.updateUserRole('1', Role.CONTRIBUTOR);
      expect(result).toEqual({ message: 'User role updated', user: updated });
    });
  });

  describe('deleteUser', () => {
    it('should throw if user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      await expect(service.deleteUser('1')).rejects.toThrow(NotFoundException);
    });

    it('should delete the user', async () => {
      const user = { id: '1' };
      mockPrisma.user.findUnique.mockResolvedValue(user);
      mockPrisma.user.delete.mockResolvedValue(undefined);
      const result = await service.deleteUser('1');
      expect(result).toEqual({ message: 'User deleted' });
      expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: '1' } });
    });
  });
});
