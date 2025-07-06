import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateCookingTipDto {
  @ApiProperty({
    example: 'Use low heat for creamy carbonara',
    description: 'Title of the cooking tip',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example:
      'To avoid scrambling the eggs, remove the pan from the heat before adding the egg mixture.',
    description: 'Detailed description of the cooking tip',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 'f1c2a4ec-b1a7-43c1-bfab-f8b2a6a21bb5',
    description: 'The ID of the recipe this tip is associated with',
  })
  @IsUUID()
  @IsNotEmpty()
  recipeId: string;
}
