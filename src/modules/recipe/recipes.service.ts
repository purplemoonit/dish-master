import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';

@Injectable()
export class RecipesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(page = 1, limit = 10) {
    try {
      return await this.prisma.recipe.findMany({
        where: {},
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch recipes');
    }
  }

  async findOne(id: string) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id },
      include: { regions: true, ingredients: true, cookingTips: true },
    });
    if (!recipe) throw new NotFoundException('Recipe not found');
    return recipe;
  }

  async search(query: string) {
    try {
      return await this.prisma.recipe.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { otherNames: { hasSome: [query] } },
          ],
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Search failed');
    }
  }

  async filter(filters: any) {
    try {
      return await this.prisma.recipe.findMany({ where: filters });
    } catch (error) {
      throw new InternalServerErrorException('Filtering failed');
    }
  }

  async findByRegion(regionId: string) {
    return this.prisma.recipe.findMany({
      where: {
        regions: {
          some: { regionId },
        },
      },
    });
  }

  async findByIngredient(ingredientId: string) {
    return this.prisma.recipe.findMany({
      where: {
        ingredients: {
          some: { ingredientId },
        },
      },
    });
  }

  async getCookingTips(id: string) {
    const recipe = await this.findOne(id);
    return recipe.cookingTips;
  }

  async create(dto: CreateRecipeDto, userId: string) {
    try {
      console.log(dto);
      return await this.prisma.recipe.create({
        data: {
          ...dto,
          userId,
          regions: dto.regionIds
            ? {
                create: dto.regionIds.map((regionId) => ({
                  region: {
                    connect: { id: regionId },
                  },
                })),
              }
            : undefined,
          ingredients: dto.ingredientIds
            ? {
                create: dto.ingredientIds.map((ingredientId) => ({
                  ingredient: {
                    connect: { id: ingredientId },
                  },
                })),
              }
            : undefined,
        },
      });
    } catch (error) {
      console.log('Error creating recipe:', error);
      throw new InternalServerErrorException('Recipe creation failed');
    }
  }

  async update(id: string, dto: UpdateRecipeDto) {
    try {
      return await this.prisma.recipe.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      throw new InternalServerErrorException('Update failed');
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.recipe.delete({ where: { id } });
      console.log('Recipe deleted successfully');
    } catch (error) {
      throw new InternalServerErrorException('Delete failed');
    }
  }

  async updateRating(id: string, rate: number) {
    return this.prisma.recipe.update({
      where: { id },
      data: { rate },
    });
  }

  async updateRegions(id: string, regionIds: string[]) {
    return this.prisma.recipe.update({
      where: { id },
      data: {
        regions: {
          deleteMany: {},
          create: regionIds.map((regionId) => ({ regionId })),
        },
      },
    });
  }

  async updateIngredients(id: string, ingredientIds: string[]) {
    return this.prisma.recipe.update({
      where: { id },
      data: {
        ingredients: {
          deleteMany: {},
          create: ingredientIds.map((ingredientId) => ({ ingredientId })),
        },
      },
    });
  }

  async updateCookingTips(id: string, tips: string[]) {
    return this.prisma.recipe.update({
      where: { id },
      data: {
        cookingTips: {
          set: tips.map((tipId) => ({ id: tipId })),
        },
      },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.recipe.findMany({
      where: { userId },
    });
  }

  async getRecent() {
    return this.prisma.recipe.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
  }

  async getPopular() {
    return this.prisma.recipe.findMany({
      orderBy: { rate: 'desc' },
      take: 10,
    });
  }

  async getRandom() {
    const count = await this.prisma.recipe.count();
    const skip = Math.floor(Math.random() * count);
    const [random] = await this.prisma.recipe.findMany({
      skip,
      take: 1,
    });
    return random;
  }

  async getTypes() {
    return this.prisma.recipe.findMany({ select: { type: true } });
  }

  async getDifficulties() {
    return this.prisma.recipe.findMany({ select: { difficulty: true } });
  }
}
