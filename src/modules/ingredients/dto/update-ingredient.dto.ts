import { IsBoolean, IsOptional, IsString, IsUrl } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateIngredientDto {
  @ApiPropertyOptional({
    example: 'Tomato',
    description: 'Updated name of the ingredient',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/images/tomato.png',
    description: 'Updated image URL',
  })
  @IsOptional()
  @IsUrl()
  image?: string;

  @ApiPropertyOptional({
    example: 'Vegetable',
    description: 'Updated category',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    example: false,
    description: 'Toggle ingredient active status',
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
