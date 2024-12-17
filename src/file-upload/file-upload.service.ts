import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFileUploadDto } from './dto/create-file-upload.dto';
import { UpdateFileUploadDto } from './dto/update-file-upload.dto';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model, Types } from 'mongoose';
import { Ingredient, ingredientDoc } from 'src/ingrediant/entities/ingredient.entity';
import { platDoc } from 'src/plat/entities/plat.entity';
import { User } from 'src/auth/schemas/user.schema';

@Injectable()
export class FileUploadService {

  constructor(
    @InjectModel('Ingredient') private readonly ingredientModel: Model<ingredientDoc>,
    @InjectModel('Plat') private readonly platModel: Model<platDoc>,
    @InjectModel('User') private readonly userModel: Model<User>,
  ) {}
  async updateEntityImage(entity:string  , id:string  , imagePath : string)
  {
    let model
    switch(entity)
    {
      case "Ingredient":
        model = this.ingredientModel
      break
      case "Plat":
        model = this.platModel
      break
      case "User":
        model = this.userModel
      break
      default:
        throw new NotFoundException(`Entity ${entity} not found.`);
    }
    
    let isObjectId = isValidObjectId(id);
    let entityDocument;
    if(isObjectId)
    {
      entityDocument = await model.findById(new Types.ObjectId(id));
    }
    else
    {
      entityDocument = await model.findOne({"name" : {'$regex': `^${id}$`, $options: 'i'}})
    }
    if (!entityDocument) {
      throw new NotFoundException(`${entity} with ID ${id} not found.`);
    }

    entityDocument.image = imagePath;
    return entityDocument.save();
  
  }
  
}
