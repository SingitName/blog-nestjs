import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/database/entities/user.entity";
import { Repository } from "typeorm";
import { RegisterUserDto } from "../auth/auth.dto";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository:Repository<User>
    ){}
    async create (registerDto:RegisterUserDto):Promise<User>{
        const user= await this.userRepository.create(registerDto);
        return await this.userRepository.save(user);
    }
    async findAll():Promise<User[]>{
        return await this.userRepository.find();
    }
    async findById(id:string):Promise<User>{
        return await this.userRepository.findOneBy({id});
    }
    async findByEmail(email:string){
        return  await this.userRepository.findOneBy({email});
    }
}