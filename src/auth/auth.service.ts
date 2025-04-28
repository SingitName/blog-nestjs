import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register_user.dto';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login_user.dto';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from 'src/user/entities/role';
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
            const user = await this.userRepository.save({...registerUserDto,refresh_token:"",password:hashpassword});
        return user;
    }
    async findUserByEmail(email:string):Promise<User>{
        const user= await this.userRepository.findOne({where:{email}});
        return user;
    }
    async login(loginUserDto:LoginUserDto):Promise<any>{
        const user = await this.userRepository.findOne({where:{email:loginUserDto.email}});
      
        const checkPass = await bcrypt.compare(loginUserDto.password,user.password);
        if(!checkPass  || !user){
            throw new HttpException("Username & Password không chính xác!",HttpStatus.UNAUTHORIZED);
        }
        const payload = {id:user.id,firstName:user.firstName,lastName:user.lastName,email:user.email,avatar:user.avatar,role:user.role,};
         return this.generateToken(payload);
    }
  
    async logout(email: string): Promise<void> {
        const user = await this.userRepository.createQueryBuilder('user')
            .where('user.email = :email', { email: email })
            .getOne();
        if (!user) {
            throw new Error("Không tìm thấy user!");
        }
        // Xóa refresh token khỏi database
        await this.userRepository.createQueryBuilder()
            .update(User)
            .set({ refresh_token: "" })
            .where('email = :email', { email: email })
            .execute();
    }
    async generateToken(payload:{id:number,firstName:string,lastName:string,email:string,avatar:string,role:UserRole}){
        const access_token = await this.jwtService.signAsync(payload);
        const refresh_token = await this.jwtService.signAsync(payload,{
            secret:'12345',
            expiresIn:'1h',
        })
        await this.userRepository.update(
            {email:payload.email},
            {refresh_token:refresh_token},
        )
        return {
            ...payload,
            access_token,
            refresh_token,
            
        };
    }

}
