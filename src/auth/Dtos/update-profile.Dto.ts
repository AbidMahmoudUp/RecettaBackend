import {IsNotEmpty, IsOptional } from "class-validator";
import {  Types } from "mongoose";
import { SignupDto } from "./Signup";
import { PartialType } from "@nestjs/mapped-types";

export class updateProfileDto extends PartialType(SignupDto) {
   
    @IsNotEmpty()
    userId: Types.ObjectId;

    @IsOptional()
    profileImage: string;
}