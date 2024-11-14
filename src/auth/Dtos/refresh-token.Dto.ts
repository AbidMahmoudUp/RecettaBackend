import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator'

export class RefreshTokenDto {
    @ApiProperty(
        {
            description: "Need refresh token to be provided here",
            required: true
        }
    )
    @IsString()
    refreshToken: string;
}