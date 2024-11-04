import { Injectable } from '@nestjs/common';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Inventory, inventoryDoc } from './entities/inventory.entity';
import { Model } from 'mongoose';

@Injectable()
export class InventoryService {


  @InjectModel(Inventory.name) private model = Model<inventoryDoc>

  async create(createInventoryDto: CreateInventoryDto) {
    return await this.model.create(createInventoryDto)
  }

  async findAll() {
    return await this.model.find().populate("ingrediants.ingrediant")
  }

  async findOne(id: string) {
    return await this.model.findById(id)
  }

  async findOneByUserID(id: string) {
    return await this.model.findOne({"user" : { $eq : id }}).populate("ingrediants.ingrediant")
  }

  async update(id: string, updateInventoryDto: UpdateInventoryDto) {
    return await this.model.findByIdAndUpdate(id , updateInventoryDto ,{new : true})
  }

  async remove(id: string) {
    return await this.model.findByIdAndDelete(id)
  }
}
