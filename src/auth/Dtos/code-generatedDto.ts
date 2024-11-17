import {IsEmail ,IsNotEmpty , IsString} from "class-validator";

export class GeneratedCodeDto {
    @IsString()
    user_id: string; 

    @IsString()
    code: string;

}