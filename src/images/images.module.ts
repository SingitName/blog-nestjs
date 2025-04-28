import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Images } from "./entities/images.entity";
import { User } from "src/user/entities/user.entity";
import { ConfigModule } from "@nestjs/config";
import { ImagesService } from "./images.service";


@Module({
    imports:[ConfigModule,TypeOrmModule.forFeature([Images,User])],
    providers:[ConfigModule,ImagesService],
    controllers:[],
    exports:[ImagesService],
})
export class ImagesModule{}