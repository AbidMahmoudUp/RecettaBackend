import { Injectable } from '@nestjs/common';
import { CreateIngrediantDto } from './dto/create-ingrediant.dto';
import { UpdateIngrediantDto } from './dto/update-ingrediant.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Ingrediant, ingrediantDoc } from './entities/ingrediant.entity';
import { Model } from 'mongoose';

@Injectable()
export class IngrediantService {

  @InjectModel(Ingrediant.name) private model = Model<ingrediantDoc>

  async create(createIngrediantDto: CreateIngrediantDto) {
    return await this.model.create(createIngrediantDto);
  }

  async findAll() {
    return await this.model.find()
  }

  async findOneById(id: string) {
    return await this.model.findById(id)
  }

  async update(id: string, updateIngrediantDto: UpdateIngrediantDto) {
    return await this.model.findByIdAndUpdate(id, updateIngrediantDto, {new : true})
  }

  async remove(id: string) {
    return await this.model.findByIdAndDelete(id)
  }
}
