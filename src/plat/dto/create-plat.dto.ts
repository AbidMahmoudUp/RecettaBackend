import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"
import { Types } from "mongoose"
import { Ingredient } from "src/ingrediant/entities/ingredient.entity"

export class CreatePlatDto {

    @ApiProperty(
        {
            example: "Spaghetti",
            description: "Name of the recipe"
        }
    )
    @IsString()
    name: string
    @IsString()
    title: string
    @IsString()
    description: string
    @IsString()
    imageRecipe: string
    @IsString()
    category :string
    @IsString()
    cookingTime: string
    @IsString()
    energy: string
    @IsString()
    rating : string
    @ApiProperty({
        example: "[{ingredient: ObjectId, qte : 10}]",
        required: true
    })
    @IsNotEmpty()
    ingredients: [{ingredient: Ingredient, qte : number}]

    instructions : [string] 

}
