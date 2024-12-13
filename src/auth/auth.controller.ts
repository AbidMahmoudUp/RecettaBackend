import { Body, Controller, Get, Post, Put, UploadedFile, UseInterceptors, UseGuards, Res, Param, NotFoundException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthService } from './auth.service';
import { SignupDto } from './Dtos/Signup';
import { LoginDto } from './Dtos/LoginDto';
import { RefreshTokenDto } from './Dtos/refresh-token.Dto';
import { ChangePasswordDto } from './Dtos/change-passwordDto';
import { AuthGuard } from 'src/guards/auth.guard';
import { ForgetPasswordDto } from './Dtos/forget_passwordDto';
import { ResetPasswordDto } from './Dtos/reset-passwordDto';
import { updateProfileDto } from './Dtos/update-profile.Dto';
import { Types } from 'mongoose';
import { Response } from 'express';

@Controller('api/auth')
export class AuthController {

    constructor(private authService: AuthService) {
    }
  
    @Get('profile-image/:userId')
    async getProfileImage(@Param('userId') userId: string, @Res() res: Response) {
      try {
        const imagePath = await this.authService.getUserProfileImage(userId);
    
        
        return res.sendFile(imagePath);  
      } catch (error) {
        console.error('Error:', error);
        throw new NotFoundException(error.message); // Error handling
      }
    }
    

    
    @Post('upload_profile_image')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './assets',
                filename: (req, file, callback) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    const ext = extname(file.originalname);
                    callback(null, `image-${uniqueSuffix}${ext}`);
                },
            }),
            fileFilter: (req, file, callback) => {
                // Accept only image files
                if (!file.mimetype.startsWith('image/')) {
                    return callback(new Error('Only image files are allowed!'), false);
                }
                callback(null, true);
            },
        }),
    )
    async uploadFile(
        @UploadedFile() file: Express.Multer.File,
        @Body() body: { userId: string }, // Extract userId from the form-data
    ) {
        console.log(file);
    
        // Convert userId to ObjectId
        const userId = new Types.ObjectId(body.userId);
    
        // Prepare the user data
        const user: updateProfileDto = {
            userId : userId,
            profileImage: file.filename.toString(),
        };
        await this.authService.updateProfile(user);
    
        return {
            message: 'Image uploaded successfully!',
            filename: file.filename,
        };
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

    @Get('get-all-users')
    async getAllUsers() {
        return this.authService.getAllUsers();
    }


    //@UseGuards(AuthGuard)
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
    async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
        return this.authService.changePassword(changePasswordDto.userId, changePasswordDto.oldPassword, changePasswordDto.newPassword);
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
