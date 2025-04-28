import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { User } from "src/user/entities/user.entity";
import { ConfigModule } from "@nestjs/config";
import { Video } from "./entities/videos.entity";
import { VideosService } from "./videos.service";
import { VideoController } from "./videos.controller";
import { GoogleService } from "src/google/google/google.service";


@Module({
    imports:[ConfigModule,TypeOrmModule.forFeature([Video,User])],
    providers:[ConfigModule,VideosService,GoogleService],
    controllers:[VideoController],
    exports:[VideosService],
})
export class VideoModule{}