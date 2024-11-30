import {IsNotEmpty } from "class-validator";
import { ObjectId } from "mongoose";
import { SignupDto } from "./Signup";
import { PartialType } from "@nestjs/mapped-types";

export class updateProfileDto extends PartialType(SignupDto) {
   
    @IsNotEmpty()
    userId: ObjectId;
}