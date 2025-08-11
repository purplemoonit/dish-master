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
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../user/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../user/auth/guards/roles.guard';
import { Role } from '@prisma/client';
import { Roles } from '../user/auth/roles.decorator';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { RecipesService } from './recipes.service';
import { ApiKeyGuard } from '../user/auth/guards/api-key.guard';

@ApiTags('Recipes')
@Controller('recipes')
export class RecipesController {
  constructor(private readonly service: RecipesService) {}

  // ---------- Public Endpoints ----------
  @Get()
  @ApiOperation({ summary: 'Get all active recipes' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.service.findAll(page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one recipe by ID' })
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search recipes' })
  async search(@Query('q') query: string) {
    return this.service.search(query);
  }

  @Get('filter')
  @ApiOperation({ summary: 'Filter recipes' })
  async filter(@Query() filters: any) {
    return this.service.filter(filters);
  }

  @Get('by-region/:regionId')
  async findByRegion(@Param('regionId') regionId: string) {
    return this.service.findByRegion(regionId);
  }

  @Get('by-ingredient/:ingredientId')
  async findByIngredient(@Param('ingredientId') ingredientId: string) {
    return this.service.findByIngredient(ingredientId);
  }

  @Get(':id/cooking-tips')
  async getCookingTips(@Param('id') id: string) {
    return this.service.getCookingTips(id);
  }

  // ---------- Authenticated/Contributor Access ----------
  @UseGuards(ApiKeyGuard)
  @ApiBearerAuth()
  @Post()
  //   @Roles(Role.ROOT, Role.CONTRIBUTOR)
  @ApiCreatedResponse({ description: 'Recipe created successfully' })
  async create(@Body() dto: CreateRecipeDto, @Req() req: Request) {
    const userId = (req as any).user.id;
    console.log('Creating recipe for user:', userId);
    return this.service.create(dto, userId);
  }

  @Patch(':id')
  @Roles(Role.ROOT, Role.CONTRIBUTOR)
  async update(@Param('id') id: string, @Body() dto: UpdateRecipeDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ROOT, Role.CONTRIBUTOR)
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Patch(':id/rate')
  async rate(@Param('id') id: string, @Body('rate') rate: number) {
    return this.service.updateRating(id, rate);
  }

  @Patch(':id/regions')
  @Roles(Role.ROOT, Role.CONTRIBUTOR)
  async updateRegions(
    @Param('id') id: string,
    @Body('regionIds') regionIds: string[],
  ) {
    return this.service.updateRegions(id, regionIds);
  }

  @Patch(':id/ingredients')
  @Roles(Role.ROOT, Role.CONTRIBUTOR)
  async updateIngredients(
    @Param('id') id: string,
    @Body('ingredientIds') ingredientIds: string[],
  ) {
    return this.service.updateIngredients(id, ingredientIds);
  }

  @Patch(':id/cooking-tips')
  @Roles(Role.ROOT, Role.CONTRIBUTOR)
  async updateCookingTips(
    @Param('id') id: string,
    @Body('tips') tips: string[],
  ) {
    return this.service.updateCookingTips(id, tips);
  }

  // ---------- Advanced/Public Exploration ----------
  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string) {
    return this.service.findByUser(userId);
  }

  @Get('recent')
  async recent() {
    return this.service.getRecent();
  }

  @Get('popular')
  async popular() {
    return this.service.getPopular();
  }

  @Get('random')
  async random() {
    return this.service.getRandom();
  }

  @Get('types')
  async getTypes() {
    return this.service.getTypes();
  }

  @Get('difficulties')
  async getDifficulties() {
    return this.service.getDifficulties();
  }
}
