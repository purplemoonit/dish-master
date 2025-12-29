import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesGuard } from 'src/common/roles.guard';
import { Roles } from 'src/common/roles.decorator';
import { JwtAuthGuard } from 'src/common/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({ status: 201, description: 'User created successfully.' })
  async create(@Body() dto: CreateUserDto) {
    return this.userService.createUser(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('get-all-users')
  @ApiOperation({ summary: 'Get all users' })
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get(':email')
  @ApiOperation({ summary: 'Get user by email' })
  async findByEmail(@Param('email') email: string) {
    const user = await this.userService.findByEmail(email);
    return { ...user, password: undefined };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':email/api-key')
  @ApiOperation({ summary: 'Regenerate API key by email' })
  async regenerateApiKeyByEmail(@Param('email') email: string) {
    return { apiKey: await this.userService.regenerateApiKeyByEmail(email) };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  async findById(@Param('id') id: string) {
    const user = await this.userService.findById(id);
    return { ...user, password: undefined };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id/api-key')
  @ApiOperation({ summary: 'Regenerate API key' })
  async regenerateApiKey(@Param('id') id: string) {
    return { apiKey: await this.userService.regenerateApiKeyById(id) };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by ID' })
  async deleteUser(@Param('id') id: string) {
    return this.userService.deleteUserById(id);
  }
}
