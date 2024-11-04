import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { IngrediantService } from './ingrediant.service';
import { CreateIngrediantDto } from './dto/create-ingrediant.dto';
import { UpdateIngrediantDto } from './dto/update-ingrediant.dto';

@Controller('api/ingrediant')
export class IngrediantController {
  constructor(private readonly ingrediantService: IngrediantService) {}

  @Post()
  async create(@Body() createIngrediantDto: CreateIngrediantDto) {
    return await this.ingrediantService.create(createIngrediantDto);
  }

  @Get()
  async findAll() {
    return await this.ingrediantService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.ingrediantService.findOneById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateIngrediantDto: UpdateIngrediantDto) {
    return await this.ingrediantService.update(id, updateIngrediantDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.ingrediantService.remove(id);
  }
}
