import { ApiProperty } from "@nestjs/swagger";
import { Ingredient } from "./ingrediant/entities/ingredient.entity";

export class PromptDto
{
    @ApiProperty({
        example: "I want a recipe for ...",
        required: true,
        description: "Prompt for the ia"
    })
    ingredients: [{ingredient: Ingredient, qte: number}]
}