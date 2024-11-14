import { ApiProperty } from "@nestjs/swagger";
import {IsEmail ,IsNotEmpty , IsString} from "class-validator";

export class LoginDto {

    @ApiProperty(
        {
            example: "test@gmail.com",
            description: "User email",
            required : true
        }
    )
    @IsEmail()
    @IsNotEmpty()
    email: string;


    @ApiProperty(
        {
            example: "something123*",
            description: "User password",
            required : true
        }
    )
    @IsString()
    @IsNotEmpty()
    password: string;

}