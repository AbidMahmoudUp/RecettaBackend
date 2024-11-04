import { PartialType } from '@nestjs/mapped-types';
import { CreateIngrediantDto } from './create-ingrediant.dto';

export class UpdateIngrediantDto extends PartialType(CreateIngrediantDto) {}
