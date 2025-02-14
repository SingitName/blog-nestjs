import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register_user.dto';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login_user.dto';
import { JwtService } from '@nestjs/jwt';
import { google } from 'googleapis';
@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private readonly userRepository:Repository<User>,
        private jwtService:JwtService,
    ){
    }
    private oauth2Client: any;
    async register(registerUserDto:RegisterUserDto):Promise<User>{
        const hashpassword = await bcrypt.hash(registerUserDto.password,10);
            const user = await this.userRepository.save({...registerUserDto,refesh_token:"",password:hashpassword});
        return user;
    }
    async findUserByEmail(email:string):Promise<User>{
        const user= await this.userRepository.findOne({where:{email}});
        return user;
    }
    validateUser(profile: any) {
        return profile;
      }
    getOauth2Client() {
        return this.oauth2Client;
      }
    async login(loginUserDto:LoginUserDto):Promise<any>{
        const user = await this.userRepository.findOne({where:{email:loginUserDto.email}});
        if(!user){
            throw new HttpException("Email không tồn tại!",HttpStatus.UNAUTHORIZED);
        }
        const checkPass = await bcrypt.compare(loginUserDto.password,user.password);
        if(!checkPass){
            throw new HttpException("Password không chính xác!",HttpStatus.UNAUTHORIZED);
        }
        const payload = {id:user.id,email:user.email};
         return this.generateToken(payload);
    }
    googleLogin() {
        return { message: 'User logged in successfully via Google' };
      }
    async generateToken(payload:{id:number,email:string}){
        const access_token = await this.jwtService.signAsync(payload);
        const refresh_token = await this.jwtService.signAsync(payload,{
            secret:'12345',
            expiresIn:'1h',
        })
        await this.userRepository.update(
            {email:payload.email},
            {refesh_token:refresh_token},
        )
        return {
            ...payload,
            access_token,
            refresh_token,
        };
    }




    async handleVerifyToken(token) {
        try {
          const payload = this.jwtService.verify(token); 
          return payload['email'];
        } catch (e) {
          throw new HttpException(
            {
              key: '',
              data: {},
              statusCode: HttpStatus.UNAUTHORIZED,
            },
            HttpStatus.UNAUTHORIZED,
          );
        }
      }
}
