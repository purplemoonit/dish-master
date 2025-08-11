import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Difficulty } from '@prisma/client';

export class CreateRecipeDto {
  @ApiProperty({ example: 'Spaghetti Carbonara' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: ['https://example.com/image1.jpg'],
    description: 'List of image URLs',
    type: [String],
  })
  @IsArray()
  @IsUrl(undefined, { each: true })
  gallery: string[];

  @ApiProperty({
    example: ['main'],
    description: 'Categories like ["main", "dessert"]',
  })
  @IsArray()
  @IsString({ each: true })
  type: string[];

  @ApiProperty({
    example: ['Pasta Carbonara'],
    description: 'Other names or aliases',
  })
  @IsArray()
  @IsString({ each: true })
  otherNames: string[];

  @ApiProperty({ example: 'Classic Roman pasta with eggs and pancetta' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ enum: Difficulty, example: Difficulty.MEDIUM })
  @IsEnum(Difficulty)
  difficulty: Difficulty;

  @ApiProperty({ example: 30, description: 'Duration in minutes' })
  @IsInt()
  duration: number;

  @ApiProperty({
    example: ['Boil water', 'Cook pasta', 'Mix eggs and cheese'],
    description: 'Preparation steps',
  })
  @IsArray()
  @IsString({ each: true })
  preparation: string[];

  @ApiProperty({
    example: ['region-id-1'],
    description: 'List of region IDs (optional)',
    type: [String],
    required: false,
  })
  @IsArray()
  @IsUUID('all', { each: true })
  @IsOptional()
  regionIds?: string[];

  @ApiProperty({
    example: ['ingredient-id-1'],
    description: 'List of ingredient IDs (optional)',
    type: [String],
    required: false,
  })
  @IsArray()
  @IsUUID('all', { each: true })
  @IsOptional()
  ingredientIds?: string[];

  @ApiProperty({
    example: ['tip-id-1'],
    description: 'List of cooking tip IDs (optional)',
    type: [String],
    required: false,
  })
  @IsArray()
  @IsUUID('all', { each: true })
  @IsOptional()
  cookingTipIds?: string[];
}
