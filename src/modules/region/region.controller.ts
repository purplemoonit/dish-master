import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { RegionsService } from './region.service';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../user/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../user/auth/guards/roles.guard';
import { Role } from '@prisma/client';
import { Roles } from '../user/auth/roles.decorator';

@ApiTags('Regions')
@ApiBearerAuth()
@Controller('regions')
export class RegionController {
  constructor(private readonly service: RegionsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all regions' })
  @ApiOkResponse({ description: 'List of regions returned successfully' })
  async findAll() {
    return this.service.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ROOT, Role.CONTRIBUTOR)
  @ApiOperation({ summary: 'Create a new region' })
  @ApiCreatedResponse({ description: 'Region created successfully' })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  async create(@Body() dto: CreateRegionDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ROOT, Role.CONTRIBUTOR)
  @ApiOperation({ summary: 'Update a region' })
  @ApiOkResponse({ description: 'Region updated successfully' })
  @ApiNotFoundResponse({ description: 'Region not found' })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  async update(@Param('id') id: string, @Body() dto: UpdateRegionDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ROOT, Role.CONTRIBUTOR)
  @ApiOperation({ summary: 'Delete a region' })
  @ApiOkResponse({ description: 'Region deleted successfully' })
  @ApiNotFoundResponse({ description: 'Region not found' })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
