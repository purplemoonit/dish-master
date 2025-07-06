import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateIngredientDto {
  @ApiProperty({
    example: 'Tomato',
    description: 'Name of the ingredient (must be unique)',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    example: 'https://example.com/images/tomato.png',
    description: 'Optional image URL for the ingredient',
  })
  @IsOptional()
  @IsUrl()
  image?: string;

  @ApiProperty({
    example: 'Vegetable',
    description: 'Category of the ingredient (e.g., Vegetable, Herb)',
  })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Whether the ingredient is active',
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
