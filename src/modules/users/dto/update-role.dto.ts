import { IsEnum } from 'class-validator';
import { Role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRoleDto {
  @ApiProperty({ enum: Role, example: Role.CONTRIBUTOR })
  @IsEnum(Role)
  role: Role;
}
