import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"
import { Types } from "mongoose"
import { Ingrediant } from "src/ingrediant/entities/ingrediant.entity"

export class CreatePlatDto {

    @ApiProperty(
        {
            example: "Spaghetti",
            description: "Name of the recipe"
        }
    )
    @IsString()
    name: string

    @ApiProperty({
        example: "[{ingrediant: ObjectId, qte : 10}]",
        required: true
    })
    @IsNotEmpty()
    ingrediants: [{ingrediant: Ingrediant, qte : number}]

}
