import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Inventory, inventoryDoc } from './entities/inventory.entity';
import { Model } from 'mongoose';
import { response } from 'express';
import { Ingredient } from 'src/ingrediant/entities/ingredient.entity';

@Injectable()
export class InventoryService {


  @InjectModel(Inventory.name) private model = Model<Inventory>

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

  async updateByAddingIngredients(id: string,updateIngredientDto : UpdateInventoryDto)
  {
      let inventory : Inventory = await this.model.findOne({"user": {$eq : id}}).populate("ingredients.ingredient")
      if(!inventory)
      {
        return undefined
      }

      console.log(inventory)
      console.log(updateIngredientDto)
      let ingredientsToAdd : {ingredient: Ingredient, qte: number, date: string}[] = []
      updateIngredientDto.ingredients.forEach((ingredientUpdates) => {
        let index = inventory.ingredients.findIndex((ingredientInvetory) => {
          console.log(ingredientInvetory.ingredient._id.equals(ingredientUpdates.ingredient._id))
          return ingredientInvetory.ingredient._id.equals(ingredientUpdates.ingredient._id)
        })
        console.log(index)
        if(index != -1)
        {
          inventory.ingredients.at(index).qte += Number(ingredientUpdates.qte)
        }
        else
        {
          let object = {ingredient: ingredientUpdates.ingredient, qte: ingredientUpdates.qte, date: new Date().toLocaleString()}
          ingredientsToAdd.push(object)
        }
      })
      ingredientsToAdd.forEach(ingred => {
        inventory.ingredients.push(ingred)
      })
      return this.model.findOneAndUpdate({user : inventory.user}, inventory, {new : true})
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
}
