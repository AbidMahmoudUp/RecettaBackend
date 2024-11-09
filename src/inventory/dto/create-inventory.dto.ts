import { IsNotEmpty } from "class-validator"
import { Ingrediant } from "src/ingrediant/entities/ingrediant.entity"
import { User } from "src/auth/schemas/user.schema"

export class CreateInventoryDto {

    user :User

    @IsNotEmpty()
    ingrediants: [{ingrediant: Ingrediant, qte : number}]


}
