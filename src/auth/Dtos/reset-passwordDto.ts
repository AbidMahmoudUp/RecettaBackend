import { IsString, Matches, MinLength} from "class-validator";

export class ResetPasswordDto {
    @IsString()
    userId: string;
  

    @IsString()
    @MinLength(6)
    @Matches(/^(?=.*[0-9])/, { message: 'Password must contain at least one number' })
    newPassword: string;
}