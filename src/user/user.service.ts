import { User } from './entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Not, Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create_user.dto';
import * as bcrypt from 'bcrypt'
import { UpdateUserDto } from './dto/update_user.dto';
import { Message } from 'src/messages/entities/message.entity';
// import { Message } from 'src/messages/entities/message.entity';
@Injectable()
export class UserService {
    
    constructor(
        @InjectRepository(User) 
        private userRepository:Repository<User>,
        @InjectRepository(Message) 
        private messageRepository:Repository<Message>,

    ){}
    async findAll(loggedInUserId: number):Promise<User[]>{
        return await this.userRepository.find({
            where: {
                id: Not(loggedInUserId) 
            }
        });
    }
    async findAllId():Promise<User[]>{
        return await this.userRepository.find();
    }
    async findOne(condition: any): Promise<User | undefined> {
        return this.userRepository.findOne(condition);
      }
    async findId(id : number):Promise<User>{
        return await this.userRepository.findOne({where:{id}});
    }
    async getUsersByEmail(email:string):Promise<User[]>{
        return await this.userRepository.find({where:{email:email}});
    }
    async getUserByEmail(email:string):Promise<User>{
        return await this.userRepository.findOne({where:{email:email}});
    }
    async create(create_user:CreateUserDto):Promise<User>{
        const hashPassword = await bcrypt.hash(create_user.password,10);

        const user = await this.userRepository.save({...create_user,refesh_token:"Token_tam_thoi",password:hashPassword});
        return user;
    }
    async update(id:number,updateUserDto:UpdateUserDto):Promise<UpdateResult>{
        return await this.userRepository.update(id,updateUserDto);
    }
    async delete(id: number): Promise<DeleteResult> {
        // Xóa tất cả các bản ghi liên quan trong bảng user_conversation bằng query SQL thủ công
        await this.userRepository.query(`DELETE FROM user_conversation WHERE user_id = ?`, [id]);

        // Xóa tất cả các message liên quan đến user
        await this.messageRepository.delete({ user_id: id });

        // Sau đó mới xóa user
        return await this.userRepository.delete(id);
    }
}
