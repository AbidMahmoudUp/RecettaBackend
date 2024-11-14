import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './Dtos/Signup';
import { LoginDto } from './Dtos/LoginDto';
import { RefreshToken } from './schemas/refresh-token.schemas';
import { RefreshTokenDto } from './Dtos/refresh-token.Dto';
import { ApiBody, ApiResponse } from '@nestjs/swagger';

@Controller('api/auth')
export class AuthController {

    constructor(private authService: AuthService) {
    }

    @ApiResponse({ status: 201})
    @ApiResponse({ status: 404, description: 'A property is invalid'})
    @ApiBody({
       type: SignupDto,
       description: 'Json structure for user object',
    })
    @Post('signup')
    async signUp(@Body() signupData: SignupDto) {
        return this.authService.signUp(signupData);
    }


    @ApiResponse({ status: 200})
    @ApiResponse({ status: 403, description: 'Wrong credentials.'})
    @ApiBody({
       type: LoginDto,
       description: 'Json structure for user object',
    })
    @Post('login')
    async login(@Body() loginCredentials: LoginDto) {
        return this.authService.login(loginCredentials);
    }

    @ApiResponse({ status: 200})
    @ApiResponse({ status: 403, description: 'Invalid token'})
    @ApiBody({
       type: RefreshTokenDto,
       description: 'Json structure for user object',
    })
    @Post('refresh')
    async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
        return this.authService.refreshTokens(refreshTokenDto.refreshToken);
    }


}
