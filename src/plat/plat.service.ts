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
    return await this.model.find().populate({
      path: "ingrediants.ingrediant",
      model: "Ingrediant"
    }).exec()
  }

  async findOne(id: string) {
    return await this.model.findById(id)
  }

  async update(id: string, updatePlatDto: UpdatePlatDto) {
    return await this.model.findByIdAndUpdate(id, updatePlatDto, {new : true})
  }

  async remove(id: string) {
    return await this.model.findByIdAndDelete(id)
  }
}
