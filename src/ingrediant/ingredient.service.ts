import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Ingredient, ingredientDoc } from './entities/ingredient.entity';
import { Model, Types } from 'mongoose';
import { console } from 'inspector';

@Injectable()
export class IngredientService {

  @InjectModel(Ingredient.name) private model = Model<ingredientDoc>

  async create(createIngredientDto: CreateIngredientDto) {
    return await this.model.create(createIngredientDto);
  }
  

  async findAll() {
    return await this.model.find()
  }

  async findOneById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Invalid ID format: ${id}`);
    }

    let ingredient = await this.model.findById(new Types.ObjectId(id));


    if (!ingredient) {
      throw new NotFoundException(`Ingredient with ID ${id} not found.`);
    }
    return ingredient;
  }

  async update(id: string, updateIngredientDto: UpdateIngredientDto) {
    return await this.model.findByIdAndUpdate(id, updateIngredientDto, {new : true})
  }

  async remove(id: string) {
    return await this.model.findByIdAndDelete(id)
  }
  async updateImage(id: string , imagePath : string ) :Promise<Ingredient>
  {
      var ingredient =await this.findOneById(id)
      console.log(ingredient)
      if(!ingredient)
      {
        throw new NotFoundException("ingredient with ID ${id} not found .")
      }
      ingredient.image = imagePath
      console.log(imagePath)
      console.log(ingredient.image)
      return ingredient.save();
  }

  async findOneByName(name: string)
  {
    return await this.model.findOne({"name" : {'$regex': `^${name}$`, $options: 'i'}});
  }


}
