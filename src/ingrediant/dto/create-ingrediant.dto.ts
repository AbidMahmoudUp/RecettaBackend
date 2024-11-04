import { IsNotEmpty, IsString } from "class-validator"

export class CreateIngrediantDto {



    @IsString()
    name : string


    @IsNotEmpty()
    image : string


}
