import { Controller, Post, Body, UseInterceptors, Res} from '@nestjs/common';
import { StableDiffusionAiService } from './stable-diffusion-ai.service';
import { CreateStableDiffusionAiDto } from './dto/create-stable-diffusion-ai.dto';
import { UpdateStableDiffusionAiDto } from './dto/update-stable-diffusion-ai.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { createReadStream } from 'fs';
import { diskStorage } from 'multer';

@Controller('api/stable-diffusion-ai')
export class StableDiffusionAiController {
  constructor(private readonly stableDiffusionAiService: StableDiffusionAiService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file',{
    storage: diskStorage({
      destination:'./assets',
      filename:(req,file,callback) =>
      {
        const uniqueName = Date.now()+ '+' + Math.round(Math.random() *1e9)
        const extentionfile = file.originalname.split('.').pop()
        const filename = `${file.fieldname}-${uniqueName}.${extentionfile}`
        callback(null,filename)
      },

    }),
  }),
)  async genrateImage(@Body() data:CreateStableDiffusionAiDto , @Res() res :any  ){
    const filePath = await this.stableDiffusionAiService.generateImage(data)
    const file  = createReadStream(filePath)
    file.pipe(res)
    //return this.stableDiffusionAiService.generateImage(data)
  }
}
