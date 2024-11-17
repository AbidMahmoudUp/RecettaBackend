import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('api/file-upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post(':entity/:id')
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
async uploadImage(@Param('entity') entity:string ,@Param('id') id:string ,@UploadedFile()file : Express.Multer.File)
{
  return this.fileUploadService.updateEntityImage(entity,id,file.filename)
}
}
