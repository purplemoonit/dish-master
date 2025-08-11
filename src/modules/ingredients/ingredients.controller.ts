import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { IngredientsService } from './ingredients.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { Role } from '@prisma/client';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiCreatedResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../user/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../user/auth/guards/roles.guard';
import { Roles } from '../user/auth/roles.decorator';

@ApiTags('Ingredients')
@ApiBearerAuth()
@Controller('ingredients')
export class IngredientsController {
  constructor(private readonly ingredientsService: IngredientsService) {}

  @ApiQuery({
    name: 'category',
    required: false,
    description: 'Filter ingredients by category',
  })
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ROOT, Role.CONTRIBUTOR, Role.VIEWER)
  @ApiQuery({ name: 'category', required: false })
  @ApiOperation({ summary: 'Get only active ingredients (Viewer access)' })
  @ApiOkResponse({ description: 'List of active ingredients returned' })
  findActive(@Query('category') category?: string) {
    if (category) return this.ingredientsService.findByCategory(category);
    return this.ingredientsService.findActive();
  }

  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ROOT, Role.CONTRIBUTOR)
  @ApiOperation({ summary: 'Get all ingredients (Active and Inactive)' })
  @ApiOkResponse({ description: 'Full list of ingredients returned' })
  findAllWithInactive() {
    return this.ingredientsService.findAllWithInactive();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ROOT, Role.CONTRIBUTOR, Role.VIEWER)
  @ApiOperation({ summary: 'Get ingredient by ID' })
  @ApiOkResponse({ description: 'Ingredient found' })
  @ApiNotFoundResponse({ description: 'Ingredient not found' })
  findOne(@Param('id') id: string) {
    return this.ingredientsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ROOT, Role.CONTRIBUTOR)
  @ApiOperation({ summary: 'Create a new ingredient' })
  @ApiCreatedResponse({ description: 'Ingredient created successfully' })
  @ApiForbiddenResponse({ description: 'Access denied' })
  create(@Body() dto: CreateIngredientDto) {
    return this.ingredientsService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ROOT, Role.CONTRIBUTOR)
  @ApiOperation({ summary: 'Update an existing ingredient' })
  @ApiOkResponse({ description: 'Ingredient updated successfully' })
  @ApiNotFoundResponse({ description: 'Ingredient not found' })
  @ApiForbiddenResponse({ description: 'Access denied' })
  update(@Param('id') id: string, @Body() dto: UpdateIngredientDto) {
    return this.ingredientsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ROOT, Role.CONTRIBUTOR)
  @ApiOperation({ summary: 'Delete an ingredient' })
  @ApiOkResponse({ description: 'Ingredient deleted successfully' })
  @ApiNotFoundResponse({ description: 'Ingredient not found' })
  @ApiForbiddenResponse({ description: 'Access denied' })
  remove(@Param('id') id: string) {
    return this.ingredientsService.remove(id);
  }
}
