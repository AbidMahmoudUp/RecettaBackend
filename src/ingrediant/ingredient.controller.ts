import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { IngredientService } from './ingredient.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('api/ingredient')
export class IngredientController {
  constructor(private readonly ingredientService: IngredientService) {}

  @ApiResponse({ status: 200})
    @ApiResponse({ status: 404, description: 'Property incorrect'})
    @ApiBody({
       type: CreateIngredientDto,
       description: 'Json structure for user object',
    })
  @Post()
  async create(@Body() createingredientDto: CreateIngredientDto) {
    return await this.ingredientService.create(createingredientDto);
  }

  @Post("/addWithImage")
  @UseInterceptors(FileInterceptor('file',{
    storage: diskStorage({
      destination:'./assets',
      filename:(req,file,callback) =>
      {
        const uniqueName = Date.now()+ '+' + Math.round(Math.random() *1e9)
        const extentionfile = file.originalname.split('.').pop()
        const filename = `${file.fieldname}-${uniqueName}.${extentionfile}`
        callback(null,filename)
      },

    }),
  }),
)
async addIngredientWithImage(@Body() createingredientDto: CreateIngredientDto, @UploadedFile() file: Express.Multer.File) {
  return await this.ingredientService.createWithImage(createingredientDto, file);
}

  @ApiResponse({ status: 200})
  @ApiResponse({ status: 403, description: 'Unauthorized'})
  @Get()
  async findAll() {
    return await this.ingredientService.findAll();
  }

  @ApiResponse({ status: 200})
  @ApiResponse({ status: 404, description: 'ingredient not found'})
  @ApiResponse({ status: 403, description: 'Unauthorized'})
    
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.ingredientService.findOneById(id);
  }

  @ApiResponse({ status: 200})
  @ApiResponse({ status: 404, description: 'ingredient not found'})
  @ApiResponse({ status: 403, description: 'Unauthorized'})
  @ApiBody({
     type: UpdateIngredientDto,
     description: 'Json structure for user object',
  })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateingredientDto: UpdateIngredientDto) {
    return await this.ingredientService.update(id, updateingredientDto);
  }

  @ApiResponse({ status: 200})
  @ApiResponse({ status: 404, description: 'ingredient not found'})
  @ApiResponse({ status: 403, description: 'Unauthorized'})
   
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.ingredientService.remove(id);
  }

  @Post('upload/:id')
  @UseInterceptors(FileInterceptor('file',{
    storage: diskStorage({
      destination:'./assets',
      filename:(req,file,callback) =>
      {
        const uniqueName = Date.now()+ '+' + Math.round(Math.random() *1e9)
        const extentionfile = file.originalname.split('.').pop()
        const filename = `${file.fieldname}-${uniqueName}.${extentionfile}`
        callback(null,filename)
      },

    }),
  }),
)
async uploadImage(@Param('id') id:string ,@UploadedFile()file : Express.Multer.File)
{
  return this.ingredientService.updateImage(id,file.filename)
}
}
