import { BadRequestException, Injectable, StreamableFile } from '@nestjs/common';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Inventory } from './entities/inventory.entity';
import { Model, Types } from 'mongoose';

import { Ingredient } from 'src/ingrediant/entities/ingredient.entity';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

import  * as fs from 'fs';
import { IngredientService } from 'src/ingrediant/ingredient.service';


@Injectable()
export class InventoryService {


  @InjectModel(Inventory.name) private model = Model<Inventory>
  @InjectModel(Ingredient.name) private ingredientModel = Model<Ingredient>

  private genAI : any
  private genAIFlashModel : any
  constructor(private readonly config: ConfigService)
  {
     this.genAI = new GoogleGenerativeAI(this.config.get("API_KEY"))
    this.genAIFlashModel = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

  }

  async create(createInventoryDto: CreateInventoryDto) {
    return await this.model.create(createInventoryDto)
  }

  async findAll() {
    return await this.model.find().populate("ingredients.ingredient")
  }

  async findOne(id: string) {
    return await this.model.findById(id)
  }

  async findOneByUserID(id: string) {
    return await this.model.findOne({"user" : { $eq : id }}).populate("ingredients.ingredient")
  }

  async update(id: string, updateInventoryDto: UpdateInventoryDto) {
    return await this.model.findByIdAndUpdate(id , updateInventoryDto ,{new : true})
  }

  async remove(id: string) {
    return await this.model.findByIdAndDelete(id)
  }

  async updateByAddingIngredients(id: Types.ObjectId, updateIngredientDto: UpdateInventoryDto) {
  let inventory: Inventory = await this.model
    .findOne({ "user": { $eq: id } })
    .populate("ingredients.ingredient");

  if (!inventory) {
    return undefined;
  }

  console.log(inventory);
  console.log(updateIngredientDto);

  let ingredientsToAdd: { ingredient: Ingredient, qte: number, date: string }[] = [];

  updateIngredientDto.ingredients.forEach((ingredientUpdates) => {
    if (ingredientUpdates.ingredient && ingredientUpdates.ingredient._id) {
      let index = inventory.ingredients.findIndex((ingredientInventory) => {
        if (ingredientInventory.ingredient && ingredientInventory.ingredient._id) {
          console.log(ingredientInventory.ingredient._id.equals(ingredientUpdates.ingredient._id));
          return ingredientInventory.ingredient._id.equals(ingredientUpdates.ingredient._id);
        }
        console.log("Ingredient in inventory is null or invalid:", ingredientInventory.ingredient);
        return false;  // Avoid null access error
      });

      console.log(index);
      if (index != -1) {
        inventory.ingredients.at(index).qte += Number(ingredientUpdates.qte);
      } else {
        let object = {
          ingredient: ingredientUpdates.ingredient,
          qte: ingredientUpdates.qte,
          date: new Date().toLocaleString(),
        };
        ingredientsToAdd.push(object);
      }
    } else {
      console.log("Invalid ingredient in update:", ingredientUpdates);
    }
  });

  ingredientsToAdd.forEach(ingred => {
    inventory.ingredients.push(ingred);
  });

  return this.model
    .findOneAndUpdate({ user: inventory.user }, inventory, { new: true })
    .populate("ingredients.ingredient");
}



  async updateByMakingRecipes(id: string,updateIngredientDto : UpdateInventoryDto)
  {
      var inventory : Inventory = await this.model.findOne({"user": {$eq : id}}).populate("ingredients.ingredient")
      if(!inventory)
      {
        throw new BadRequestException("WHERE IS YOUR INVENTORY")
      }

    
      
      updateIngredientDto.ingredients.forEach((ingredientUpdates) => {
        let index = inventory.ingredients.findIndex((ingredientInvetory) => {
          return ingredientInvetory.ingredient._id.equals(ingredientUpdates.ingredient._id)
        })
        if(index != -1)
        {
          if(Number(inventory.ingredients.at(index).qte) >= ingredientUpdates.qte)
            inventory.ingredients.at(index).qte -= Number(ingredientUpdates.qte)
          else
          {
            throw new BadRequestException("It seems like you don't have enough of one or more ingredients to proceed with this recipe. Please adjust your inventory and try again.")
          }
        }
        else
        {
          throw new BadRequestException("You don't have the ingredient")
        }
      })

      return this.model.findOneAndUpdate({user : inventory.user}, inventory, {new : true}).populate("ingredients.ingredient");
  }

  async ingredientsDetectionTest(id : string ,file: Express.Multer.File)
  {
    let inventory : Inventory = await this.model.findOne({"user" : { $eq : id }}).populate("ingredients.ingredient")
      if(!inventory)
      {
        throw new BadRequestException("No inventory Found")
      }
    //console.log(buffer)
    const prompt = "LIST JSON RESPONSE ONLY I want you to identify ingredients in the image and give me this format of json as a response (name MUST be singular and the quantity is int) [{name: , quantity}, {}, {}]";
const image = {
  inlineData: {
    data: Buffer.from(file.buffer).toString("base64"),
    mimeType: "image/png",
  },
};

const result = await this.genAIFlashModel.generateContent([prompt, image]);
console.log(result.response.text());
const response = await result.response
    const text : string =response.text()
    let jsonText = text.slice(7)
    jsonText = jsonText.slice(0,jsonText.indexOf("```"))
    console.log(jsonText)
    let ingredientList = JSON.parse(jsonText)
    console.log(ingredientList)
    let ingredientsToAdd : {ingredient: Ingredient, qte: number, date: string}[] = []
    if(ingredientList)
    {
      for(var ingredient of ingredientList)
      {
        console.log(ingredient.name)
        let fetchedIngredient : Ingredient = await this.ingredientModel.findOne({"name" : {'$regex': `^${ingredient.name}$`, $options: 'i'}})
        console.log(fetchedIngredient)
        if(fetchedIngredient)
        {
          let index = inventory.ingredients.findIndex((ingredientInvetory) => {
            return ingredientInvetory.ingredient._id.equals(fetchedIngredient._id)
          })
          if(index != -1)
          {
            inventory.ingredients.at(index).qte += Number(ingredient.quantity)
          }
          else
          {
            let object = {ingredient: fetchedIngredient, qte: ingredient.quantity, date: new Date().toLocaleString()}
            ingredientsToAdd.push(object)
          }
          
        }

      }
         
      ingredientsToAdd.forEach(ingred => {
        inventory.ingredients.push(ingred)
      })
      console.log(inventory)
      return this.model.findOneAndUpdate({user : inventory.user}, inventory, {new : true})
    }

    return "Ok"
  }
}
