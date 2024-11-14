import { ApiProperty } from "@nestjs/swagger";

export class PromptDto
{
    @ApiProperty({
        example: "I want a recipe for ...",
        required: true,
        description: "Prompt for the ia"
    })
    prompt: string
}