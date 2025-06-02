import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Images } from "./entities/images.entity";
import { Repository } from "typeorm";
import { CreateImagesDto } from "./dto/create.dto";

@Injectable()
export class ImagesService{
    constructor(
        @InjectRepository(Images)
        private readonly imagesRepository:Repository<Images>,
    ){}
    async create(createImagesDto:CreateImagesDto):Promise<Images>{
        return await this.imagesRepository.save(createImagesDto);
    }
}