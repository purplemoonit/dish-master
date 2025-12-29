import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    const hashPassword = await bcrypt.hash(createUserDto.password, 10);
    const apiKey = await randomBytes(16).toString('hex');

    try {
      const user = await this.prisma.user.create({
        data: {
          ...createUserDto,
          role: 'VIEWER',
          password: hashPassword,
          apiKey,
        },
      });

      return { ...user, password: undefined };
    } catch (error: any) {
      throw new BadRequestException('Failed to create user');
    }
  }

  async findByEmail(email: string) {
    try {
      const user = await this.prisma.user.findUnique({ where: { email } });

      if (!user) {
        throw new NotFoundException(`User with email ${email} not found`);
      }

      return user;
    } catch (error: any) {
      throw new InternalServerErrorException('Failed to fetch user');
    }
  }

  async findById(id: string) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });

      if (!user) throw new NotFoundException('User not found');

      return user;
    } catch (error: any) {
      throw new InternalServerErrorException('Failed to fetch user');
    }
  }

  async regenerateApiKeyById(id: string) {
    try {
      const newApiKey = randomBytes(16).toString('hex');
      await this.prisma.user.update({
        where: { id },
        data: { apiKey: newApiKey },
      });
      return { apiKey: newApiKey };
    } catch (error: any) {
      throw new InternalServerErrorException('Failed to regenerate API key');
    }
  }

  async regenerateApiKeyByEmail(email: string) {
    try {
      const newApiKey = randomBytes(16).toString('hex');
      await this.prisma.user.update({
        where: { email },
        data: { apiKey: newApiKey },
      });
      return newApiKey;
    } catch (error: any) {
      throw new InternalServerErrorException('Failed to regenerate API key');
    }
  }

  async getAllUsers() {
    try {
      const users = await this.prisma.user.findMany();
      return users.map((user) => ({ ...user, password: undefined }));
    } catch (error: any) {
      throw new InternalServerErrorException('Failed to fetch users');
    }
  }

  async deleteUserById(id: string) {
    try {
      await this.prisma.user.delete({ where: { id } });
      return { message: 'User deleted successfully' };
    } catch (error: any) {
      throw new InternalServerErrorException('Failed to delete user');
    }
  }
}
