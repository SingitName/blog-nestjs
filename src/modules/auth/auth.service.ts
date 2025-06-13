import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { Injectable, Post } from "@nestjs/common";
import { RegisterUserDto } from './auth.dto';
import { STATUS_CODES } from 'http';

@Injectable()
export class AuthService {
    constructor(
        private userService:UserService,
        private jwtService:JwtService,
    ){}
    async Register(registerDto:RegisterUserDto){
        const checkEmail = await this.userService.findByEmail(registerDto.email);
        if(checkEmail) {
            return {error:'Email already exit!'}
        }
        
        const user = {
            email:registerDto.email,
            password:registerDto.password,
            firstName:registerDto.firstName,
            lastName:registerDto.lastName,
        }
        const newUser = await this.userService.create(user);
        const token = this.jwtService.sign(user,{expiresIn:'1d'});
        if(token){
            return {newUser, data:'Register Successfully',STATUS_CODES:200};
        }
    }
}