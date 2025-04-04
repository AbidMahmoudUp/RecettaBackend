import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class CreateIngredientDto {

    @IsString()
    _id : string

    @ApiProperty({
        example: "Pepper",
        required: true
    })

    @IsString()
    name : string


    @ApiProperty({
        example: "https://test.com/img",
        required: true
    })
    //@IsNotEmpty()
    image : string


}
