import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register_user.dto';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login_user.dto';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from 'src/user/entities/role';
import { UserService } from 'src/user/user.service';
@Injectable()
export class AuthService {
    constructor(
        private userService:UserService,
        private jwtService:JwtService,
    ){
    }
    async register(registerUserDto:RegisterUserDto){
        const matchEmail   = await this.userService.getUserByEmail(
            registerUserDto.email,
        );
        if(matchEmail){
            throw new HttpException('Email already exit',HttpStatus.BAD_REQUEST);
        }
        const user = {
            email: registerUserDto.email,
            password:registerUserDto.password,
            firstName:registerUserDto.firstName,
        };
        const token = await this.jwtService.sign(user,{ expiresIn:'1d'});
        const createUser  = await this.userService.create({...registerUserDto,access_token:token});
        return createUser;
    }
    async login(loginUserDto:LoginUserDto):Promise<any>{
        const user = await this.userService.findOne({where:{email:loginUserDto.email}});
      
        const checkPass = await bcrypt.compare(loginUserDto.password,user.password);
        if(!checkPass  || !user){
            throw new HttpException("Username & Password không chính xác!",HttpStatus.UNAUTHORIZED);
        }
        const payload = {id:user.id,firstName:user.firstName,lastName:user.lastName,email:user.email,avatar:user.avatar,role:user.role,};
         return this.generateToken(payload);
    }

    async generateToken(payload:{id:number,firstName:string,lastName:string,email:string,avatar:string,role:UserRole}){
        const access_token = await this.jwtService.signAsync(payload);
        return {
            ...payload,
            access_token,     
        };
    }

}
