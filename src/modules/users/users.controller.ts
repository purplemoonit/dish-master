import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  Req,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './auth/roles.guard';
import { Roles } from './auth/roles.decorator';
import { Role } from '@prisma/client';
import { UpdateRoleDto } from './dto/update-role.dto';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiOkResponse({ description: 'User profile returned successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  getMe(@Req() req) {
    return this.usersService.getUserById(req.user.sub);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ROOT)
  @ApiOperation({ summary: 'List all users (admin only)' })
  @ApiOkResponse({ description: 'List of users returned' })
  @ApiForbiddenResponse({ description: 'Access denied (not ROOT)' })
  findAll() {
    return this.usersService.findAll();
  }

  @Patch('regenerate-api-key')
  @ApiOperation({ summary: 'Regenerate API key for current user' })
  @ApiOkResponse({ description: 'API key regenerated' })
  regenerateApiKey(@Req() req) {
    return this.usersService.regenerateApiKey(req.user.sub);
  }

  @Patch(':id/role')
  @UseGuards(RolesGuard)
  @Roles(Role.ROOT)
  @ApiOperation({ summary: 'Update user role (admin only)' })
  @ApiOkResponse({ description: 'User role updated' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiForbiddenResponse({ description: 'Access denied (not ROOT)' })
  updateUserRole(@Param('id') userId: string, @Body() dto: UpdateRoleDto) {
    return this.usersService.updateUserRole(userId, dto.role);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ROOT)
  @ApiOperation({ summary: 'Delete user (admin only)' })
  @ApiOkResponse({ description: 'User deleted' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiForbiddenResponse({ description: 'Access denied (not ROOT)' })
  deleteUser(@Param('id') userId: string) {
    return this.usersService.deleteUser(userId);
  }
}
