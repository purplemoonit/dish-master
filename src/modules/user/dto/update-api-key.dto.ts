import { IsUUID } from 'class-validator';

export class UpdateApiKeyDto {
  @IsUUID()
  userId: string;
}
