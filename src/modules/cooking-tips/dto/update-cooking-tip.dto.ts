import { PartialType } from '@nestjs/swagger';
import { CreateCookingTipDto } from './create-cooking-tip.dto';

export class UpdateCookingTipDto extends PartialType(CreateCookingTipDto) {}
