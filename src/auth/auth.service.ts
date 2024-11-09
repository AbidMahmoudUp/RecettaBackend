import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { SignupDto } from './Dtos/Signup';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './Dtos/LoginDto';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { RefreshToken } from './schemas/refresh-token.schemas';

@Injectable()
export class AuthService {

    constructor(@InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(RefreshToken.name) private refreshTokenModel: Model<RefreshToken>,
        private jwtService: JwtService) {

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

        await this.userModel.create({
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
        // generate Jwt token



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

    async storeRefreshToken(token: string, userId) {
        const expiryDate = new Date()
        expiryDate.setDate(expiryDate.getDate() + 3);
        await this.refreshTokenModel.create({ token, userId, expiryDate })
    }

    async refreshTokens(refreshToken: string) {
        const token = await this.refreshTokenModel.findOneAndDelete({
            token: refreshToken,
            expiryDate: { $gte: new Date() },
        })
        if (!token) {
            throw new UnauthorizedException('Refresh Token is invalid');
        }
        return this.generateUserTokens(token.userId);

    }

}
