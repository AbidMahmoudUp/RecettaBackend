import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { PromptDto } from './prompt.ia';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}


  
  @Post("api/generative-ia")
  async getIngrediants(@Body() body: PromptDto )
  {
    return await this.appService.getPromptResponse(body.prompt)
  }
}
