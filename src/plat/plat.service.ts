import { Injectable } from '@nestjs/common';
import { CreatePlatDto } from './dto/create-plat.dto';
import { UpdatePlatDto } from './dto/update-plat.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Plat, platDoc } from './entities/plat.entity';
import { Model } from 'mongoose';

@Injectable()
export class PlatService {

  @InjectModel(Plat.name) private model = Model<platDoc>

  async create(createPlatDto: CreatePlatDto) {
    return await this.model.create(createPlatDto)
  }

  async findAll() {
    const plats = await this.model.find().populate({
      path: "ingredients.ingredient",
      model: "Ingredient",
    }).exec();
  
    console.log("Populated Plats:", JSON.stringify(plats, null, 2));
    return plats;
  }
  async findOne(id: string) {
    return await this.model.findById(id).populate({
      path: "ingredients.ingredient",
      model: "Ingredient",
    }).exec()
  }

  async update(id: string, updatePlatDto: UpdatePlatDto) {
    return await this.model.findByIdAndUpdate(id, updatePlatDto, {new : true})
  }

  async remove(id: string) {
    return await this.model.findByIdAndDelete(id)
  }
}
