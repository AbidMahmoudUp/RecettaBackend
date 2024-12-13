import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { SignupDto } from './Dtos/Signup';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose, { Model, Types } from 'mongoose';
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
import * as path from 'path';
import * as fs from 'fs';
import { InventoryService } from 'src/inventory/inventory.service';
import { CreateInventoryDto } from 'src/inventory/dto/create-inventory.dto';


@Injectable()
export class AuthService {

    constructor(@InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(RefreshToken.name) private refreshTokenModel: Model<RefreshToken>,
        @InjectModel(GeneratedCode.name) private generatedCode: Model<GeneratedCode>,
        private jwtService: JwtService,
        private mailService: MailService,
    private inventoryService : InventoryService) {

    }


    async getAllUsers() {

        const  users: User[]= await this.userModel.find();
        
        return users
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

        let user =  await this.userModel.create({
            name,
            age : 0,
            phone,
            email,
            password: hashedPassword,
            profileImage : "blank_profile_pic.jpg",

        });

        let inventory = new CreateInventoryDto()
        inventory.user = user
        
        await this.inventoryService.create(inventory)
        return user
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
        if (user.banned) {
            throw new UnauthorizedException("your account is banned");
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
            profileImage: user.profileImage
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
        const profile = updateProfileData.profileImage;
        if (email !== "") {
            if (updateProfileData.email !== user.email) {
                const emailInUse = await this.userModel.findOne({
                    email: updateProfileData.email,
                });
                
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
        
        if (profile !== "") {
            updateduser = {
                ...updateduser,
                profileImage: profile,
            }
        }



        return await this.userModel.findByIdAndUpdate(updateProfileData.userId, updateduser);
    }


    async getUserProfileImage(userId: string): Promise<string> {
        const objectId = new Types.ObjectId(userId);  // Ensure userId is an ObjectId
    
        const user = await this.userModel.findById(objectId);  // Find the user by ID
    
        if (!user) {
          throw new Error('User not found');
        }
    
        if (user.profileImage) {
          // Debugging: Log to check if profileImage exists
          console.log('Profile Image:', user.profileImage);
    
          // Resolve the path for the image
          const imagePath = path.resolve(__dirname, '..', '..', 'assets', user.profileImage);

          
          // Debugging: Log the resolved image path
          console.log('Resolved Image Path:', imagePath);
    
          // Check if the file exists at the resolved path
          if (fs.existsSync(imagePath)) {
            return imagePath;
          } else {
            throw new Error('Profile image not found');
          }
        } else {
           return path.resolve(__dirname, '..', '..', 'assets','blank_profile_pic.jpg');
        }
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
