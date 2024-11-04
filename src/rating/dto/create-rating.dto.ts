import { IsNotEmpty, IsPositive } from "class-validator"
import { Types } from "mongoose"

export class CreateRatingDto {


    @IsNotEmpty()
    user : Types.ObjectId

 
    @IsNotEmpty()
    plat : Types.ObjectId


    @IsPositive()
    rate : number


    comment: string

}
