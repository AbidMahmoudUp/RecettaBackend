import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsPositive, IsString } from "class-validator"
import { Types } from "mongoose"

export class CreateRatingDto {


    @ApiProperty({
        example: "ObjectId",
        required: true,
        description: "the user ref"
    })
    @IsNotEmpty()
    user : Types.ObjectId

 
    @ApiProperty({
        example: "ObjectId",
        required: true,
        description: "the recipe ref"
    })
    @IsNotEmpty()
    plat : Types.ObjectId


    @ApiProperty({
        example: "4",
        required: true,
        description: "from 0 to 5 rating"
    })
    @IsPositive()
    rate : number

    @ApiProperty({
        example: "I didn't like this recipe",
        description: "Comment of the recipe",
        required: false
    })
    comment: string

}
