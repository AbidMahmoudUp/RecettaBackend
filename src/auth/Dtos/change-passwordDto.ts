import {IsEmail ,IsNotEmpty , IsString} from "class-validator";
import { ObjectId } from "mongoose";

export class ChangePasswordDto {
    
    @IsString()
    userId : ObjectId;

    @IsString()
    oldPassword: string; 

    @IsString()
    newPassword: string;

}