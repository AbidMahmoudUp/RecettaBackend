import { GoogleGenerativeAI } from '@google/generative-ai';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class AppService {
  private genAI : any
  private genAIFlashModel : any
  constructor(private readonly config: ConfigService)
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
    console.log(jsonText)
    //console.log(text)
    const jsonResponse = JSON.parse(jsonText)
    return jsonResponse
  }
}
