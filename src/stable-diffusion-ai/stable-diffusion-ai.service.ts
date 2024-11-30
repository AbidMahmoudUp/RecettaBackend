import { Injectable } from '@nestjs/common';
import { CreateStableDiffusionAiDto } from './dto/create-stable-diffusion-ai.dto';
import { getDataFolderPath, persistData } from '../utils/file.utils';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class StableDiffusionAiService {
  constructor(private readonly httpService: HttpService) {}

  async generateImage(generatedImage: CreateStableDiffusionAiDto) {
    const engineId = 'stable-diffusion-v1-6';
    const apiHost = 'https://api.stability.ai';
    const apiKey = process.env.STABILITY_API_KEY;

    if (!apiKey) throw new Error('Missing Stability API key.');

    try {
      const result = await lastValueFrom(
        this.httpService.post(
          `${apiHost}/v1/generation/${engineId}/text-to-image`,
          {
            cfg_scale: 7,
            clip_guidance_preset: 'FAST_BLUE',
            height: 512,
            width: 512,
            steps: 50,
            samples: 1,
            text_prompts: [
              {
                text: generatedImage.prompt,
                weight: 1,
              },
            ],
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'image/png',
              Authorization: `Bearer ${apiKey}`,
            },
            responseType: 'arraybuffer',
          }
        )
      );
    
      const filePath = `${getDataFolderPath()}/${Date.now()}.png`;
      await persistData(Buffer.from(result.data), filePath);
      console.log('Image saved at:', filePath);
      return filePath;
    
    } catch (error) {
      if (error.response) {
        // Convert the Buffer response to a string and parse the JSON
        const errorMessage = Buffer.from(error.response.data).toString('utf-8');
        try {
          const parsedError = JSON.parse(errorMessage);
          console.error('API Response Error:', parsedError);
          throw new Error(`API error: ${parsedError.message || 'Unknown error'}`);
        } catch (parseError) {
          console.error('Error parsing response:', parseError);
          throw new Error(`API error: Unable to parse error response`);
        }
      } else {
        console.error('Error generating image:', error.message);
      }
      throw new Error('Failed to generate image');
    }
    
  }
}
