import { GoogleGenerativeAI } from '@google/generative-ai';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { persistData } from './utils/file.utils';


@Injectable()
export class AppService {
  private genAI : any
  private genAIFlashModel : any
  constructor(private readonly config: ConfigService,private readonly httpService: HttpService)
  {
     this.genAI = new GoogleGenerativeAI(this.config.get("API_KEY"))
    this.genAIFlashModel = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

  }

  async getPromptResponse(prompt : string)
  { 
    const result = await this.genAIFlashModel.generateContent(prompt)
    const response = await result.response
    const text : string =response.text()
    let jsonText = text.slice(7)
    jsonText = jsonText.slice(0,jsonText.indexOf("```"))
    //.log(jsonText)
    //console.log(text)
    const jsonResponse = <any[]>JSON.parse(jsonText)
    console.log(jsonResponse)
    for(var index = 0; index < jsonResponse.length; index++)
    {
      console.log(jsonResponse.at(index).title)
      //console.log(json)
      let path = await this.generateImage(jsonResponse.at(index).title)
      jsonResponse.at(index).image = path.slice(path.indexOf('/'))
    }
    //jsonResponse[0].image = "1733405720312.png"
    return jsonResponse
  }



  async generateImage(generatedImage: string) {
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
                text: generatedImage,
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
    
      const filePath = `assets/${Date.now()}.png`;
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
