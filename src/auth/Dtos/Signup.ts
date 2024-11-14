import { ApiProperty } from "@nestjs/swagger";
import {Matches ,IsEmail ,IsNumber ,IsNotEmpty , IsString, matches, IsOptional } from "class-validator";

export class SignupDto {

    @ApiProperty(
        {
            example: "Amine",
            description: "User Name",
            required: true
        }
        
    )
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty(
        {
            example: "23",
            description: "User Age",
            required : false
        }
    )
    @IsNumber()
    @IsOptional()
    age: number;

    @ApiProperty(
        {
            example: "55918014",
            description: "User phone",
            required: false
        }
    )
    @IsString()
    @IsOptional()
    phone: string;

    @ApiProperty(
        {
            example: "test@gmail.com",
            description: "User email",
            required: true
        }
    )
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty(
        {
            example: "something123*",
            description: "User password"
        }
    )
    @IsString()
    @IsNotEmpty()
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, { message: 'Password too weak' })
    password: string;

}