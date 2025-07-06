import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCookingTipDto } from './dto/create-cooking-tip.dto';
import { UpdateCookingTipDto } from './dto/update-cooking-tip.dto';

@Injectable()
export class CookingTipsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.cookingTip.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByRecipe(recipeId: string) {
    return this.prisma.cookingTip.findMany({
      where: { recipeId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const tip = await this.prisma.cookingTip.findUnique({ where: { id } });
    if (!tip) {
      throw new NotFoundException(`Cooking tip with id ${id} not found`);
    }
    return tip;
  }

  async create(dto: CreateCookingTipDto) {
    return this.prisma.cookingTip.create({
      data: {
        title: dto.title,
        description: dto.description,
        recipeId: dto.recipeId,
      },
    });
  }

  async update(id: string, dto: UpdateCookingTipDto) {
    await this.findOne(id);

    return this.prisma.cookingTip.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.cookingTip.delete({ where: { id } });
  }
}
