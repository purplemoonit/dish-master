import { ApiProperty } from '@nestjs/swagger';

export class ApiKeyResponseDto {
  @ApiProperty({ description: 'The newly generated API key' })
  apiKey: string;
}
