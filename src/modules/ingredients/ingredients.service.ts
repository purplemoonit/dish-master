import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';

@Injectable()
export class IngredientsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateIngredientDto) {
    return this.prisma.ingredient.create({
      data: {
        name: dto.name,
        image: dto.image,
        category: dto.category,
        isActive: dto.isActive ?? true,
      },
    });
  }

  async findActive() {
    return this.prisma.ingredient.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        image: true,
        category: true,
        createdAt: true,
        updatedAt: true,
        isActive: true,
      },
    });
  }

  async findAllWithInactive() {
    return this.prisma.ingredient.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        image: true,
        category: true,
        createdAt: true,
        updatedAt: true,
        isActive: true,
      },
    });
  }

  async findByCategory(category: string) {
    return this.prisma.ingredient.findMany({
      where: {
        category,
        isActive: true,
      },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        image: true,
        category: true,
        createdAt: true,
        updatedAt: true,
        isActive: true,
      },
    });
  }

  async findOne(id: string) {
    const ingredient = await this.prisma.ingredient.findUnique({
      where: { id },
    });

    if (!ingredient || !ingredient.isActive) {
      throw new NotFoundException('Ingredient not found');
    }

    return ingredient;
  }

  async update(id: string, dto: UpdateIngredientDto) {
    await this.findOne(id); // throws if not found or inactive

    return this.prisma.ingredient.update({
      where: { id },
      data: {
        name: dto.name,
        image: dto.image,
        category: dto.category,
        isActive: dto.isActive,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.ingredient.delete({
      where: { id },
    });
  }
}
