import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {  JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';

@Injectable()
export class JwtConfig implements JwtOptionsFactory {

  constructor(private readonly configService: ConfigService) {}

  createJwtOptions(): JwtModuleOptions{

    console.log(
      this.configService.get<string>('SECRET'));

        return{
          secret: this.configService.get<string>('SECRET'),
         
          //publicKey: string | Buffer;
          //privateKey?: jwt.Secret;

        }
  }

}