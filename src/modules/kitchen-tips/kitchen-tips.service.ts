import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateKitchenTipDto } from './dto/create-kitchen-tip.dto';
import { UpdateKitchenTipDto } from './dto/update-kitchen-tip.dto';

@Injectable()
export class KitchenTipsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateKitchenTipDto) {
    try {
      return await this.prisma.kitchenTip.create({ data: dto });
    } catch (error) {
      console.log('Failed to create kitchen tip', error);
      throw new InternalServerErrorException('Failed to create kitchen tip');
    }
  }

  async findAll() {
    try {
      return await this.prisma.kitchenTip.findMany({
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      console.log('Failed to fetch kitchen tips:', error);
      throw new InternalServerErrorException('Failed to fetch kitchen tips');
    }
  }

  async findOne(id: string) {
    try {
      const tip = await this.prisma.kitchenTip.findUnique({ where: { id } });
      if (!tip) throw new NotFoundException('Kitchen tip not found');
      return tip;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch kitchen tip');
    }
  }

  async update(id: string, dto: UpdateKitchenTipDto) {
    try {
      const exists = await this.prisma.kitchenTip.findUnique({ where: { id } });
      if (!exists) throw new NotFoundException('Kitchen tip not found');

      return await this.prisma.kitchenTip.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to update kitchen tip');
    }
  }

  async remove(id: string) {
    try {
      const exists = await this.prisma.kitchenTip.findUnique({ where: { id } });
      if (!exists) throw new NotFoundException('Kitchen tip not found');

      return await this.prisma.kitchenTip.delete({ where: { id } });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to delete kitchen tip');
    }
  }

  async filterByTag(tag: string) {
    try {
      return await this.prisma.kitchenTip.findMany({
        where: {
          tags: {
            has: tag,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      console.log('Failed to filter kitchen tips by tag:', error);
      throw new InternalServerErrorException('Failed to filter by tag');
    }
  }

  async search(query: string) {
    try {
      return await this.prisma.kitchenTip.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      console.log('Failed to search kitchen tips:', error);
      throw new InternalServerErrorException('Failed to search kitchen tips');
    }
  }
}
