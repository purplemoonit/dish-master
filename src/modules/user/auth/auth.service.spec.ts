import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../../prisma/prisma.service';

const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
};

const mockJwtService = {
  signAsync: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should create a new user if email is unique', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue({ id: 'user123' });
      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(async () => 'hashedPassword');

      const dto = { email: 'test@example.com', password: 'pass123' };
      const result = await service.register(dto);

      expect(bcrypt.hash).toHaveBeenCalledWith('pass123', 10);
      expect(mockPrisma.user.create).toHaveBeenCalled();
      expect(result).toEqual({ message: 'User created', userId: 'user123' });
    });

    it('should throw if email already exists', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'existing' });
      await expect(
        service.register({ email: 'exists@example.com', password: '123456' }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('login', () => {
    it('should return accessToken on valid credentials', async () => {
      const user = {
        id: '1',
        email: 'a@b.com',
        password: 'hashed',
        role: 'USER',
      };
      mockPrisma.user.findUnique.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true);
      mockJwtService.signAsync.mockResolvedValue('token123');

      const result = await service.login({
        email: 'a@b.com',
        password: 'pass',
      });
      expect(bcrypt.compare).toHaveBeenCalledWith('pass', 'hashed');
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({
        sub: '1',
        email: 'a@b.com',
        role: 'USER',
      });
      expect(result).toEqual({ accessToken: 'token123' });
    });

    it('should throw if email not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      await expect(
        service.login({ email: 'not@found.com', password: '123' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw if password does not match', async () => {
      const user = {
        id: '1',
        email: 'a@b.com',
        password: 'hashed',
        role: 'USER',
      };
      mockPrisma.user.findUnique.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => false);

      await expect(
        service.login({ email: 'a@b.com', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('updateUser', () => {
    it('should update email and hash new password', async () => {
      jest.spyOn(bcrypt, 'hash').mockImplementation(async () => 'newHashed');
      mockPrisma.user.update.mockResolvedValue({ id: '1', email: 'new@x.com' });

      const dto = { email: 'new@x.com', password: 'newpass' };
      const result = await service.updateUser('1', dto);

      expect(bcrypt.hash).toHaveBeenCalledWith('newpass', 10);
      expect(mockPrisma.user.update).toHaveBeenCalled();
      expect(result).toEqual({
        message: 'User updated',
        user: { id: '1', email: 'new@x.com' },
      });
    });

    it('should update only email if no password provided', async () => {
      mockPrisma.user.update.mockResolvedValue({
        id: '1',
        email: 'only@x.com',
      });

      const dto = { email: 'only@x.com' };
      const result = await service.updateUser('1', dto);

      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(mockPrisma.user.update).toHaveBeenCalled();
      expect(result).toEqual({
        message: 'User updated',
        user: { id: '1', email: 'only@x.com' },
      });
    });
  });
});
