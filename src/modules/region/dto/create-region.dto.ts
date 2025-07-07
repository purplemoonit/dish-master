import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateRegionDto {
  @ApiProperty({
    example: 'Georgia',
    description: 'The name of the region or country',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'https://flagcdn.com/ge.svg',
    description: 'URL to the flag image of the region',
  })
  @IsUrl()
  @IsNotEmpty()
  flagImage: string;
}
