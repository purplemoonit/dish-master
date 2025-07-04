import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Role } from '@prisma/client';
import { UpdateRoleDto } from './dto/update-role.dto';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    getUserById: jest.fn(),
    findAll: jest.fn(),
    regenerateApiKey: jest.fn(),
    updateUserRole: jest.fn(),
    deleteUser: jest.fn(),
  };

  const mockReq = { user: { sub: 'user-id', role: Role.ROOT } };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('getMe', () => {
    it('should return current user', async () => {
      const user = { id: 'user-id', email: 'test@test.com' };
      mockUsersService.getUserById.mockResolvedValue(user);
      const result = await controller.getMe(mockReq);
      expect(result).toEqual(user);
      expect(service.getUserById).toHaveBeenCalledWith('user-id');
    });

    it('should throw if user not found', async () => {
      mockUsersService.getUserById.mockRejectedValue(new NotFoundException());
      await expect(controller.getMe(mockReq)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('should return list of users', async () => {
      const users = [{ id: '1' }, { id: '2' }];
      mockUsersService.findAll.mockResolvedValue(users);
      const result = await controller.findAll();
      expect(result).toEqual(users);
    });
  });

  describe('regenerateApiKey', () => {
    it('should regenerate API key', async () => {
      const response = { message: 'API key regenerated', apiKey: 'new-key' };
      mockUsersService.regenerateApiKey.mockResolvedValue(response);
      const result = await controller.regenerateApiKey(mockReq);
      expect(result).toEqual(response);
      expect(service.regenerateApiKey).toHaveBeenCalledWith('user-id');
    });

    it('should throw if user not found', async () => {
      mockUsersService.regenerateApiKey.mockRejectedValue(
        new NotFoundException(),
      );
      await expect(controller.regenerateApiKey(mockReq)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateUserRole', () => {
    it('should update the user role', async () => {
      const dto: UpdateRoleDto = { role: Role.CONTRIBUTOR };
      const updatedUser = { id: 'user-id', role: Role.CONTRIBUTOR };
      mockUsersService.updateUserRole.mockResolvedValue({
        message: 'User role updated',
        user: updatedUser,
      });
      const result = await controller.updateUserRole('user-id', dto);
      expect(result).toEqual({
        message: 'User role updated',
        user: updatedUser,
      });
      expect(service.updateUserRole).toHaveBeenCalledWith('user-id', dto.role);
    });

    it('should throw if user not found', async () => {
      mockUsersService.updateUserRole.mockRejectedValue(
        new NotFoundException(),
      );
      await expect(
        controller.updateUserRole('user-id', { role: Role.ROOT }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteUser', () => {
    it('should delete user', async () => {
      const response = { message: 'User deleted' };
      mockUsersService.deleteUser.mockResolvedValue(response);
      const result = await controller.deleteUser('user-id');
      expect(result).toEqual(response);
      expect(service.deleteUser).toHaveBeenCalledWith('user-id');
    });

    it('should throw if user not found', async () => {
      mockUsersService.deleteUser.mockRejectedValue(new NotFoundException());
      await expect(controller.deleteUser('not-found')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
