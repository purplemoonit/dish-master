import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { KitchenTipsService } from './kitchen-tips.service';
import { CreateKitchenTipDto } from './dto/create-kitchen-tip.dto';
import { UpdateKitchenTipDto } from './dto/update-kitchen-tip.dto';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiCreatedResponse,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Kitchen Tips')
@Controller('kitchen-tips')
export class KitchenTipsController {
  constructor(private readonly service: KitchenTipsService) {}

  @Get()
  @ApiOperation({ summary: 'List all kitchen tips' })
  @ApiOkResponse({ description: 'List of kitchen tips returned' })
  @ApiQuery({ name: 'tag', required: false, description: 'Filter by tag' })
  @ApiQuery({ name: 'q', required: false, description: 'Search by keyword' })
  async findAll(@Query('tag') tag?: string, @Query('q') q?: string) {
    if (tag) return this.service.filterByTag(tag);
    if (q) return this.service.search(q);
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a kitchen tip by ID' })
  @ApiOkResponse({ description: 'Kitchen tip found' })
  @ApiNotFoundResponse({ description: 'Kitchen tip not found' })
  async findOne(@Param('id') id: string) {
    const tip = await this.service.findOne(id);
    if (!tip) throw new NotFoundException('Kitchen tip not found');
    return tip;
  }

  @Post()
  @ApiOperation({ summary: 'Create a new kitchen tip' })
  @ApiCreatedResponse({ description: 'Kitchen tip created successfully' })
  async create(@Body() dto: CreateKitchenTipDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a kitchen tip' })
  @ApiOkResponse({ description: 'Kitchen tip updated successfully' })
  @ApiNotFoundResponse({ description: 'Kitchen tip not found' })
  async update(@Param('id') id: string, @Body() dto: UpdateKitchenTipDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a kitchen tip' })
  @ApiOkResponse({ description: 'Kitchen tip deleted successfully' })
  @ApiNotFoundResponse({ description: 'Kitchen tip not found' })
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
