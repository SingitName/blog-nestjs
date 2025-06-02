import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, In, Repository } from "typeorm";
import { Information } from "./entities/imformation.entity";
import { SaveInformationDto } from "./dto/save.dto";
import { TypeInformation } from "./interface/information.interface";

@Injectable()
export class InformationService{
    constructor(
        @InjectRepository(Information)
        private informationRepository:Repository<Information>,
    ){}
    async create(saveInformationDto:SaveInformationDto):Promise<Information>{
        return await this.informationRepository.save(saveInformationDto);
    }
    async deleteValue(user_id:number,value:string):Promise<DeleteResult>{
        return await this.informationRepository.delete({user_id,value});
    }
    async findBySocketId(user_id: number[]): Promise<string[]> {
        const informationList = await this.informationRepository.find({
          where: {
            user_id: In(user_id),
            type: TypeInformation.socket_id,
          },
          select: ['value'],
        });
    
        // Trả về mảng các value (socket ids)
        return informationList.map(info => info.value);
      }
      async findByUserIdAndType(userId: number, type: TypeInformation): Promise<Information | null> {
        return await this.informationRepository.findOne({
          where: { user_id: userId, type },
        });
      }
      async getSocketIdByUserId(user_id: number): Promise<string | null> {
        const information = await this.informationRepository.findOne({
          where: {
            user_id: user_id,
            type: TypeInformation.socket_id,  // Tìm thông tin theo loại socket_id
          },
          select: ['value'],  // Lấy giá trị của socket_id
        });
    
        return information ? information.value : null;  // Trả về socket_id hoặc null nếu không tìm thấy
      }
    
}