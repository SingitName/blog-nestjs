import { User } from './entities/user.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Not, Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create_user.dto';
import * as bcrypt from 'bcrypt'
import { UpdateUserDto } from './dto/update_user.dto';
import { Message } from 'src/messages/entities/message.entity';
import { GoogleService } from 'src/google/google/google.service';
import { ImagesService } from 'src/images/images.service';
import { Images } from 'src/images/entities/images.entity';
// import { Message } from 'src/messages/entities/message.entity';
@Injectable()
export class UserService {
    
    constructor(
        @InjectRepository(User) 
        private userRepository:Repository<User>,
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
        return await this.userRepository.findOne({where:{id},relations: ['conversations']});
    }
    async findUsersByIds(ids: number[]): Promise<User[]> {
        return await this.userRepository
          .createQueryBuilder('user')
          .where('user.id IN (:...ids)', { ids })
          .getMany();
      }
    async getUsersByEmail(email:string):Promise<User[]>{
        return await this.userRepository.find({where:{email:email}});
    }
    async getUserByEmail(email:string):Promise<User>{
        return await this.userRepository.findOne({where:{email:email}});
    }
    async create(create_user:CreateUserDto & {access_token:string}):Promise<User>{
        const hashPassword = await bcrypt.hash(create_user.password,10);
        const newUser = {...create_user,password:hashPassword};
        const user = await this.userRepository.save(newUser);
        return user;
    }
    async getUserWithPassword(email: string): Promise<User | null> {
        return await this.userRepository.findOne({
          where: { email: email },
          select: ['id', 'firstName', 'lastName', 'email', 'password', 'avatar',],
        });
      }
    async update(id:number,updateUserDto:UpdateUserDto):Promise<UpdateResult>{
        return await this.userRepository.update(id,updateUserDto);
    }
    // async updateAvatar(userId:number,file:Express.Multer.File):Promise<User>{
    //     const user = await this.userRepository.findOne({where:{id:userId}});
    //     if(!user){
    //         throw new Error('User not find!');
    //     }
    //     const uploadFile = await this.googleService.uploadFile(file);
    //     const newImage = new Images();
    //     newImage.fileId = uploadFile.fileId;
    //     newImage.webViewLink = uploadFile.webViewLink;
    //     newImage.webContentLink = uploadFile.webContentLink;
    //     newImage.user=user;
    //     await this.imagesService.create(newImage);
    //     user.avatar =uploadFile.fileId;
    //     return await this.userRepository.save(user);
    // }
    async createUser(userData: Partial<User>): Promise<User> {
        // Tạo đối tượng User mới từ dữ liệu truyền vào
        const newUser = this.userRepository.create({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          avatar: userData.avatar || null,  
          password: '', 
          status: 1,  
        });
    
        // Lưu người dùng vào cơ sở dữ liệu
        return await this.userRepository.save(newUser);
      }
}
