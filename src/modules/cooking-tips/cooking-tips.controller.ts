import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CookingTipsService } from './cooking-tips.service';
import { CreateCookingTipDto } from './dto/create-cooking-tip.dto';
import { UpdateCookingTipDto } from './dto/update-cooking-tip.dto';
import { Role } from '@prisma/client';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiBadRequestResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../users/auth/jwt-auth.guard';
import { RolesGuard } from '../users/auth/roles.guard';
import { Roles } from '../users/auth/roles.decorator';

@ApiTags('Cooking Tips')
@ApiBearerAuth()
@Controller('cooking-tips')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CookingTipsController {
  constructor(private readonly cookingTipsService: CookingTipsService) {}

  @Get()
  @Roles(Role.ROOT, Role.CONTRIBUTOR, Role.VIEWER)
  @ApiOperation({ summary: 'List all cooking tips or filter by recipeId' })
  @ApiQuery({
    name: 'recipeId',
    required: false,
    description: 'Filter tips by recipe ID',
  })
  @ApiOkResponse({ description: 'List of cooking tips returned' })
  findAll(@Query('recipeId') recipeId?: string) {
    if (recipeId) {
      return this.cookingTipsService.findByRecipe(recipeId);
    }
    return this.cookingTipsService.findAll();
  }

  @Get(':id')
  @Roles(Role.ROOT, Role.CONTRIBUTOR, Role.VIEWER)
  @ApiOperation({ summary: 'Get a single cooking tip by ID' })
  @ApiOkResponse({ description: 'Cooking tip found' })
  @ApiNotFoundResponse({ description: 'Cooking tip not found' })
  findOne(@Param('id') id: string) {
    return this.cookingTipsService.findOne(id);
  }

  @Post()
  @Roles(Role.ROOT, Role.CONTRIBUTOR)
  @ApiOperation({ summary: 'Create a new cooking tip' })
  @ApiCreatedResponse({ description: 'Cooking tip created successfully' })
  @ApiForbiddenResponse({ description: 'Access denied' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  create(@Body() dto: CreateCookingTipDto) {
    return this.cookingTipsService.create(dto);
  }

  @Patch(':id')
  @Roles(Role.ROOT, Role.CONTRIBUTOR)
  @ApiOperation({ summary: 'Update an existing cooking tip' })
  @ApiOkResponse({ description: 'Cooking tip updated successfully' })
  @ApiNotFoundResponse({ description: 'Cooking tip not found' })
  @ApiForbiddenResponse({ description: 'Access denied' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  update(@Param('id') id: string, @Body() dto: UpdateCookingTipDto) {
    return this.cookingTipsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ROOT, Role.CONTRIBUTOR)
  @ApiOperation({ summary: 'Delete a cooking tip' })
  @ApiOkResponse({ description: 'Cooking tip deleted successfully' })
  @ApiNotFoundResponse({ description: 'Cooking tip not found' })
  @ApiForbiddenResponse({ description: 'Access denied' })
  remove(@Param('id') id: string) {
    return this.cookingTipsService.remove(id);
  }
}
