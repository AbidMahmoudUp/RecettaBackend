import { IsNotEmpty } from "class-validator"
import { Ingrediant } from "src/ingrediant/entities/ingrediant.entity"
import { User } from "src/auth/schemas/user.schema"
import { ApiProperty } from "@nestjs/swagger"

export class CreateInventoryDto {

    @ApiProperty({
        example: "ObjectId",
        required: true
    })
    user :User

    @ApiProperty({
        example: "[{ingrediant: ObjectId, qte : 10}]",
        required: true
    })
    @IsNotEmpty()
    ingrediants: [{ingrediant: Ingrediant, qte : number}]


}
