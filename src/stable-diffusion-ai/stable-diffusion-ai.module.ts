import { Module } from '@nestjs/common';
import { StableDiffusionAiService } from './stable-diffusion-ai.service';
import { StableDiffusionAiController } from './stable-diffusion-ai.controller';
import { HttpModule } from '@nestjs/axios';


@Module({
  imports:[HttpModule],
  controllers: [StableDiffusionAiController],
  providers: [StableDiffusionAiService],
})
export class StableDiffusionAiModule {}
