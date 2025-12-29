import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({ example: 'conor.mason@dishmaster.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'strongpassword' })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'Conor Mayers' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ enum: UserRole, example: UserRole.VIEWER })
  @IsEnum(UserRole)
  role: UserRole;
}
