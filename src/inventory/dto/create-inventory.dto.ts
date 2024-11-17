import { IsNotEmpty } from "class-validator"
import { Ingredient } from "src/ingrediant/entities/ingredient.entity"
import { User } from "src/auth/schemas/user.schema"
import { ApiProperty } from "@nestjs/swagger"

export class CreateInventoryDto {

    @ApiProperty({
        example: "ObjectId",
        required: true
    })
    user :User

    @ApiProperty({
        example: "[{ingredient: ObjectId, qte : 10}]",
        required: true
    })
    @IsNotEmpty()
    ingredients: [{ingredient: Ingredient, qte : number}]


}
