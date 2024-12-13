import { Body, Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { PromptDto } from './prompt.ia';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

const prePrompt = "JSON RESPONSE ONLY: as for the schema i want the response as this example\n [{\"title\": \"name\", \"description\" : \"description\", image: \"Please provide an url of image from google\", \"category\": \"category\", \"cookingTime\": \"time in minutes\", \"energy\": \"calories\", \"rating\": \"average rating for this recipe\", \"ingredients\" : [{ \"ingredient\":{ this body is based on the ingredients sent }, \"qte\": \"QUANTITY NEEDED OF THE INGREDIENT FOR THE RECIPE (can be modified based on the recipe)\"}], \"instructions\": [ array of strings for the steps ]  }, etc...] for recipes using ONLY these ingredients that I SENT "

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  
  @Post('api/generative-ia-recipe')
  @UseInterceptors(FileInterceptor('fileImage'))
  async generateRecipe(@UploadedFile()file: Express.Multer.File)
  {
    console.log("WE ARE HITTING THE ENDPOINT")
    return await this.appService.generateRecipeFromPlat(file)
  }
  
  @ApiResponse({ status: 200})
    @ApiResponse({ status: 404, description: 'Invalid token'})
    @ApiBody({
       type: PromptDto,
       description: 'Json structure for user object',
    })
  @Post("api/generative-ia")
  async getIngredients(@Body() body: PromptDto )
  {
    
    //console.log(body.ingredients)
    let toJson = JSON.stringify(body.ingredients)
    /*body.ingredients.forEach( ingredient => {
      toJson += JSON.stringify(ingredient)
    })
 */
    let prompt = prePrompt + toJson
    //console.log(toJson)
   // console.log(toText)
    return await this.appService.getPromptResponse(prompt)
  }
}
