import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { SignupDto } from './Dtos/Signup';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './Dtos/LoginDto';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { RefreshToken } from './schemas/refresh-token.schemas';
import { nanoid } from 'nanoid';
import { ResetToken } from './schemas/reset-token.schemas';
import { MailService } from './services/mail.service';
import { GeneratedCode } from './schemas/code-generated.schemas';
import { ObjectId } from "mongoose";
import { UpdateIngredientDto } from 'src/ingrediant/dto/update-ingredient.dto';
import { delay } from 'rxjs';


@Injectable()
export class AuthService {

    constructor(@InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(RefreshToken.name) private refreshTokenModel: Model<RefreshToken>,
        @InjectModel(GeneratedCode.name) private generatedCode: Model<GeneratedCode>,
        private jwtService: JwtService,
        private mailService: MailService) {

    }


    async signUp(signupData: SignupDto) {
        const { name, age, phone, email, password } = signupData;

        const emailInUse = await this.userModel.findOne({
            email,
        });

        if (emailInUse) {
            throw new BadRequestException('Email already in use');
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        return await this.userModel.create({
            name,
            age,
            phone,
            email,
            password: hashedPassword

        });

    }

    async login(loginCredentials: LoginDto) {
        const { email, password } = loginCredentials;
        const user = await this.userModel.findOne({ email });
        if (!user) {
            throw new UnauthorizedException("Wrong credentials");
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException("Wrong credentials");
        }

        const tokens = await this.generateUserTokens(user._id);
        return {
            ...tokens,
            userId: user.id,

        };
    }

    async generateUserTokens(userId) {
        const accessToken = this.jwtService.sign({ userId }, { expiresIn: '1h' })
        const refreshToken = uuidv4();

        await this.storeRefreshToken(refreshToken, userId);
        return {
            accessToken,
            refreshToken,
        }

    }

    async DeleteUser(userId){
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        return await this.userModel.deleteOne(user._id);

    }


    async getUserData(userId) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        //await delay(6000);
        return {
            name: user.name,
            email: user.email,
            age: user.age,
            phone: user.phone,
        };
    }

    async updateProfile(updateProfileData) {

        const user = await this.userModel.findById(updateProfileData.userId);
        let updateduser = {};
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const name = updateProfileData.name;
        const age = updateProfileData.age;
        const phone = updateProfileData.phone;
        const email = updateProfileData.email;

        if (email !== "") {
            if (updateProfileData.email) {
                const emailInUse = await this.userModel.findOne({
                    email: updateProfileData.email,
                });
                if (emailInUse) {
                    throw new BadRequestException('Email already in use');
                }
            }

            updateduser = {
                ...updateduser,
                email
            }
        }
        if (name !== "") {
            updateduser = {
                ...updateduser,
                name,
            }
        }
        if (age !== "") {
            updateduser = {
                ...updateduser,
                age,
            }
        }
        if (phone !== "") {
            updateduser = {
                ...updateduser,
                phone,
            }
        }



        return await this.userModel.findByIdAndUpdate(updateProfileData.userId, updateduser);
    }

    async storeRefreshToken(token: string, userId) {
        const expiryDate = new Date()
        expiryDate.setDate(expiryDate.getDate() + 3);
        await this.refreshTokenModel.updateOne({ userId }, { $set: { expiryDate, token } }, { upsert: true, });
    }

    async refreshTokens(refreshToken: string) {
        const token = await this.refreshTokenModel.findOne({
            token: refreshToken,
            expiryDate: { $gte: new Date() },
        })
        if (!token) {
            throw new UnauthorizedException('Refresh Token is invalid');
        }
        return this.generateUserTokens(token.userId);

    }


    async changePassword(userId, oldPassword: string, newPassword: string) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found ');
        }

        const passwordMatch = await bcrypt.compare(oldPassword, user.password);
        if (!passwordMatch) {
            throw new UnauthorizedException('Wrong credentials');

        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        return await user.save();


    }


    async forgetPassword(email: string) {
        const user = await this.userModel.findOne({ email });
        const randomNumber = Math.floor(100000 + Math.random() * 900000);


        if (user) {
            //  const expiryDate = new Date();
            // expiryDate.setHours(expiryDate.getMinutes() + 2);

            await this.generatedCode.findOneAndUpdate(
                { userId: user._id },
                {
                    code: randomNumber,
                },
                { upsert: true, new: true }
            );
            this.mailService.sendPasswordResetEmail(email, randomNumber.toString());

        }
        return {
            userId: user._id, code: randomNumber.toString()
        };
    }


    async resetPassword(newPassword: string, userid: string) {
        const user = await this.userModel.findById(userid);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
    }

}
