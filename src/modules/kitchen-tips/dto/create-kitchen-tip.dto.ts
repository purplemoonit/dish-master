import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateKitchenTipDto {
  @ApiProperty({
    description: 'Title of the kitchen tip',
    example: 'How to safely chop onions',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @ApiProperty({
    description: 'Detailed description of the kitchen tip',
    example:
      'Use a sharp knife and keep your fingers tucked in using the claw grip.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Tag for categorization (e.g., safety, storage, prep)',
    example: 'safety',
  })
  @IsString()
  tags: string[];

  @ApiProperty({
    description: 'Optional image URL for the kitchen tip',
    example:
      'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.wikihow.com%2Fimages%2Fthumb%2Fc%2Fc0%2FOpen-a-Difficult-Jar-Step-4-Version-10.jpg%2Fv4-460px-Open-a-Difficult-Jar-Step-4-Version-10.jpg&f=1&nofb=1&ipt=30546d376a778910f7022b8cf8918e987b7b5467d1383894738503189833b30c',
    required: false,
  })
  @IsString()
  image?: string;

  @ApiProperty({
    description: 'Optional videoUrl URL for the kitchen tip',
    example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    required: false,
  })
  @IsString()
  videoUrl?: string;
}
