import { PartialType } from '@nestjs/swagger';
import { CreateKitchenTipDto } from './create-kitchen-tip.dto';

export class UpdateKitchenTipDto extends PartialType(CreateKitchenTipDto) {}
