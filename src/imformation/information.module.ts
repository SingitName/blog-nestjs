import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Information } from "./entities/imformation.entity";
import { ConfigModule } from "@nestjs/config";
import { InformationController } from "./information.controller";
import { InformationService } from "./information.service";
import { User } from "src/user/entities/user.entity";

@Module({
    imports:[ConfigModule,TypeOrmModule.forFeature([Information,User])],
    controllers:[InformationController],
    providers:[InformationService,ConfigModule],
    exports:[InformationService],

})
export class InformationModule{}