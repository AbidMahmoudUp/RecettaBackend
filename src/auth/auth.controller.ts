import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './Dtos/Signup';
import { LoginDto } from './Dtos/LoginDto';
import { RefreshToken } from './schemas/refresh-token.schemas';
import { RefreshTokenDto } from './Dtos/refresh-token.Dto';

@Controller('api/auth')
export class AuthController {

    constructor(private authService: AuthService) {
    }

    @Post('signup')
    async signUp(@Body() signupData: SignupDto) {
        return this.authService.signUp(signupData);
    }

    @Post('login')
    async login(@Body() loginCredentials: LoginDto) {
        return this.authService.login(loginCredentials);
    }

    @Post('refresh')
    async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
        return this.authService.refreshTokens(refreshTokenDto.refreshToken);
    }


}
