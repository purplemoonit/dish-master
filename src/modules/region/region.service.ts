import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';

@Injectable()
export class RegionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateRegionDto) {
    try {
      return await this.prisma.region.create({ data: dto });
    } catch (error) {
      console.log('Error creating region:', error);
      throw new ForbiddenException('Region already exists or invalid data');
    }
  }

  async findAll() {
    return this.prisma.region.findMany({
      orderBy: { title: 'asc' },
    });
  }

  async findOne(id: string) {
    const region = await this.prisma.region.findUnique({ where: { id } });
    if (!region) throw new NotFoundException('Region not found');
    return region;
  }

  async update(id: string, dto: UpdateRegionDto) {
    const exists = await this.prisma.region.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Region not found');

    return this.prisma.region.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    const exists = await this.prisma.region.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Region not found');

    return this.prisma.region.delete({ where: { id } });
  }
}
