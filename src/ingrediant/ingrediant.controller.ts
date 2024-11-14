import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { IngrediantService } from './ingrediant.service';
import { CreateIngrediantDto } from './dto/create-ingrediant.dto';
import { UpdateIngrediantDto } from './dto/update-ingrediant.dto';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { Ingrediant } from './entities/ingrediant.entity';

@Controller('api/ingrediant')
export class IngrediantController {
  constructor(private readonly ingrediantService: IngrediantService) {}

  @ApiResponse({ status: 200})
    @ApiResponse({ status: 404, description: 'Property incorrect'})
    @ApiBody({
       type: CreateIngrediantDto,
       description: 'Json structure for user object',
    })
  @Post()
  async create(@Body() createIngrediantDto: CreateIngrediantDto) {
    return await this.ingrediantService.create(createIngrediantDto);
  }

  @ApiResponse({ status: 200})
  @ApiResponse({ status: 403, description: 'Unauthorized'})
  @Get()
  async findAll() {
    return await this.ingrediantService.findAll();
  }

  @ApiResponse({ status: 200})
  @ApiResponse({ status: 404, description: 'Ingrediant not found'})
  @ApiResponse({ status: 403, description: 'Unauthorized'})
    
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.ingrediantService.findOneById(id);
  }

  @ApiResponse({ status: 200})
  @ApiResponse({ status: 404, description: 'Ingrediant not found'})
  @ApiResponse({ status: 403, description: 'Unauthorized'})
  @ApiBody({
     type: UpdateIngrediantDto,
     description: 'Json structure for user object',
  })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateIngrediantDto: UpdateIngrediantDto) {
    return await this.ingrediantService.update(id, updateIngrediantDto);
  }

  @ApiResponse({ status: 200})
  @ApiResponse({ status: 404, description: 'Ingrediant not found'})
  @ApiResponse({ status: 403, description: 'Unauthorized'})
   
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.ingrediantService.remove(id);
  }
}
