import { Body, Controller, Get, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './Dtos/Signup';
import { LoginDto } from './Dtos/LoginDto';
import { RefreshToken } from './schemas/refresh-token.schemas';
import { RefreshTokenDto } from './Dtos/refresh-token.Dto';
import { ChangePasswordDto } from './Dtos/change-passwordDto';
import { AuthGuard } from 'src/guards/auth.guard';
import { ForgetPasswordDto } from './Dtos/forget_passwordDto';
import { ResetPasswordDto } from './Dtos/reset-passwordDto';
import { updateProfileDto } from './Dtos/update-profile.Dto';


@Controller('api/auth')
export class AuthController {

    constructor(private authService: AuthService) {
    }


    @Post('DeleteUser')
    async DeleteUser(@Body() updateProfileData: updateProfileDto) {  
        return this.authService.DeleteUser(updateProfileData.userId);
    }

    @Post('GetUser')
    async GetUserData(@Body() updateProfileData: updateProfileDto) {  
        return this.authService.getUserData(updateProfileData.userId);
    }

    @Post('signup')
    async signUp(@Body() signupData: SignupDto) {
        return this.authService.signUp(signupData);
    }



    
    @UseGuards(AuthGuard)
    @Put('update-profile')
    async updateProfile(@Body() updateProfileData: updateProfileDto) {
        return this.authService.updateProfile(updateProfileData);
    }
    
    
    
    @Post('login')  
    async login(@Body() loginCredentials: LoginDto) {
        return this.authService.login(loginCredentials);
    }

//    @UseGuards(AuthGuard)
    @Post('refresh')
    async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
        return this.authService.refreshTokens(refreshTokenDto.refreshToken);
    }

    @UseGuards(AuthGuard)
    @Put('change-password')
    async changePassword(@Body() changePasswordDto: ChangePasswordDto  ) {
        return this.authService.changePassword(changePasswordDto.userId,changePasswordDto.oldPassword, changePasswordDto.newPassword);
    } 

    @Post('forget-password')
    async forgetPassword(@Body() forgetPasswordDto: ForgetPasswordDto) {
        return this.authService.forgetPassword(forgetPasswordDto.email);
    }


    @Put('reset-password')
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        return this.authService.resetPassword(resetPasswordDto.newPassword, resetPasswordDto.userId);
    }

}
