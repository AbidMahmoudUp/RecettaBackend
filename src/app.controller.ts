import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { PromptDto } from './prompt.ia';
import { ApiBody, ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}


  
  @ApiResponse({ status: 200})
    @ApiResponse({ status: 404, description: 'Invalid token'})
    @ApiBody({
       type: PromptDto,
       description: 'Json structure for user object',
    })
  @Post("api/generative-ia")
  async getIngrediants(@Body() body: PromptDto )
  {
    return await this.appService.getPromptResponse(body.prompt)
  }
}
