import { Controller, Post, Body, UseInterceptors, Res} from '@nestjs/common';
import { StableDiffusionAiService } from './stable-diffusion-ai.service';
import { CreateStableDiffusionAiDto } from './dto/create-stable-diffusion-ai.dto';
import { UpdateStableDiffusionAiDto } from './dto/update-stable-diffusion-ai.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { createReadStream } from 'fs';

@Controller('api/stable-diffusion-ai')
export class StableDiffusionAiController {
  constructor(private readonly stableDiffusionAiService: StableDiffusionAiService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async genrateImage(@Body() data:CreateStableDiffusionAiDto , @Res() res :any  ){
    const filePath = await this.stableDiffusionAiService.generateImage(data)
    const file  = createReadStream(filePath)
    file.pipe(res)
    //return this.stableDiffusionAiService.generateImage(data)
  }
}
