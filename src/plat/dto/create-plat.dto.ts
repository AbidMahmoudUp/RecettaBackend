import { IsNotEmpty, IsString } from "class-validator"
import { Types } from "mongoose"
import { Ingrediant } from "src/ingrediant/entities/ingrediant.entity"

export class CreatePlatDto {

    @IsString()
    name: string

    @IsNotEmpty()
    ingrediants: [{ingrediant: Ingrediant, qte : number}]

}
