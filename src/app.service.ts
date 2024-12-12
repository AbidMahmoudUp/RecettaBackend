import { GoogleGenerativeAI } from '@google/generative-ai';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { persistData } from './utils/file.utils';
import { Plat } from './plat/entities/plat.entity';
import { IngredientService } from './ingrediant/ingredient.service';
import { Ingredient } from './ingrediant/entities/ingredient.entity';

const preprompt = `Generate a JSON recipe using this schema:Recipe Schema
  {
  "title": "string",
  "description": "string",
  "image": "string",
  "category": "string",
  "cookingTime": "string",
  "energy": "string",
  "rating": "string",
  "ingredients": [{ "ingredient": "Ingredient", "qte": "int" }],
  "instructions": ["string"]
}
Use the provided ingredients array.
Include realistic values for cookingTime (minutes), energy (kcal), and rating (1-5).
Add at least three clear instructions steps or more if needed.
{ "_id": "1", "name": "Tomato", "categorie": "Vegetable", "unit": "piece", "image": "https://example.com/tomato.jpg" }
Generate a recipe referencing these ingredients while knowing that the _id of the ingredient is an object id sent with it so keep it as it is.
`
const promptOfRecipe = `Generate a valid JSON RESPONSE ONLY recipe from the image using this schema:Recipe Schema
  {
  "title": "string",
  "description": "string",
  "image": "string",
  "category": "string",
  "cookingTime": "int",
  "energy": "int",
  "rating": "int",
  "ingredients": [{"name" : "string", "qte": "int", "unit" : "string"}],
  "instructions": ["string"]
}
Include realistic values for cookingTime (minutes), energy (kcal), and rating (1-5).
Add at least three clear instructions steps or more if needed.
Generate a recipe with name of the ingredient in SINGULAR needed with their quantity and the quantity must be an INTEGER DON'T USE FLOATS.
`




@Injectable()
export class AppService {
  private genAI : any
  private genAIFlashModel : any
  constructor(private readonly config: ConfigService,private readonly httpService: HttpService, private readonly ingredientService : IngredientService)
  {
     this.genAI = new GoogleGenerativeAI(this.config.get("API_KEY"))
    this.genAIFlashModel = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

  }

  async getPromptResponse(prompt : string)
  { 
    let finalPrompt = preprompt + prompt;

    const result = await this.genAIFlashModel.generateContent(finalPrompt)
    const response = await result.response
    const text : string =response.text()
    let jsonText = text.slice(7)
    jsonText = jsonText.slice(0,jsonText.indexOf("```"))
    console.log(jsonText)
    //console.log(text)
    const jsonResponse = <any[]>JSON.parse(jsonText)
    console.log(jsonResponse)
   /* for(var index = 0; index < jsonResponse.length; index++)
    {
      console.log(jsonResponse.at(index).title)
      //console.log(json)
      let path = await this.generateImage(jsonResponse.at(index).title)
      jsonResponse.at(index).image = path.slice(path.indexOf('/'))
    }
    //jsonResponse[0].image = "1733405720312.png"
    */
    return jsonResponse
  }
  async generateRecipeFromPlat(file: Express.Multer.File)
  { 
    const image = {
      inlineData: {
        data: Buffer.from(file.buffer).toString("base64"),
        mimeType: "image/png",
      },
    };
    const result = await this.genAIFlashModel.generateContent([promptOfRecipe,image])
    const response = await result.response
    const text : string =response.text()
    let jsonText = text.slice(7)
    jsonText = jsonText.slice(0,jsonText.indexOf("```"))
    //.log(jsonText)
    console.log(jsonText)
    const jsonResponse = JSON.parse(jsonText)
    //console.log(jsonResponse)
    let recipe : Plat = new Plat()
      const jsonIngredients = <any[]>jsonResponse.ingredients
      console.log(jsonIngredients)
      for(var j = 0; j < jsonIngredients.length; j++)
      {
        let ingredient = await this.ingredientService.findOneByName(jsonIngredients.at(j).name)
        if(ingredient != null)
        {
          let object : {ingredient : Ingredient, qte : number} = {ingredient : new Ingredient(), qte : 0}
          object.ingredient = ingredient
          object.qte = jsonIngredients.at(j).qte
          console.log(recipe.ingredients.length)
          recipe.ingredients.push(object)
        }
      }
      //console.log(json)
      //let path = await this.generateImage(jsonResponse.at(index).title)
      //jsonResponse.at(index).image = path.slice(path.indexOf('/'))
    
    //jsonResponse[0].image = "1733405720312.png"
    recipe.title = jsonResponse.title
    recipe.category = jsonResponse.category
    recipe.cookingTime = jsonResponse.cookingTime
    recipe.description = jsonResponse.description
    recipe.energy = jsonResponse.energy
    recipe.image = ""
    recipe.instructions = <string[]> jsonResponse.instructions
    recipe.rating = jsonResponse.rating
    return recipe
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
