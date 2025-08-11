import { Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { randomBytes } from 'crypto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private generateApiKey(): string {
    return randomBytes(32).toString('hex');
  }

  // async getUserById(userId: string) {
  //   const user = await this.prisma.user.findUnique({
  //     where: { id: userId },
  //     select: {
  //       id: true,
  //       email: true,
  //       role: true,
  //       apiKey: true,
  //       createdAt: true,
  //     },
  //   });

  //   if (!user) throw new NotFoundException('User not found');
  //   return user;
  // }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        apiKey: true,
        createdAt: true,
      },
    });
  }

  // async regenerateApiKey(userId: string) {
  //   const updated = await this.prisma.user.update({
  //     where: { id: userId },
  //     data: { apiKey: crypto.randomUUID() },
  //     select: {
  //       id: true,
  //       email: true,
  //       apiKey: true,
  //     },
  //   });

  //   return { message: 'API key regenerated', apiKey: updated.apiKey };
  // }
  async regenerateApiKey(userId: string): Promise<{ apiKey: string }> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const newApiKey = this.generateApiKey();

    await this.prisma.user.update({
      where: { id: userId },
      data: { apiKey: newApiKey },
    });

    return { apiKey: newApiKey };
  }

  async getUserById(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, role: true, apiKey: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateUserRole(userId: string, role: Role) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    return { message: 'User role updated', user: updated };
  }

  async deleteUser(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    await this.prisma.user.delete({ where: { id: userId } });
    return { message: 'User deleted' };
  }
}
