import { PartialType } from '@nestjs/swagger';
import { CreateStableDiffusionAiDto } from './create-stable-diffusion-ai.dto';

export class UpdateStableDiffusionAiDto extends PartialType(CreateStableDiffusionAiDto) {}
