import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Information } from "src/imformation/entities/imformation.entity";
import { InformationModule } from "src/imformation/information.module";
import { User } from "src/user/entities/user.entity";
import { UserModule } from "src/user/user.module";
import { ChatGateway } from "./chat.gateway";
import { UserService } from "src/user/user.service";
import { Message } from "src/messages/entities/message.entity";
import { Conversation } from "src/conversation/entities/conversation.entity";
import { MessageModule } from "src/messages/message.module";
import { ConverSationModule } from "src/conversation/conversation.module";
import { MessageService } from "src/messages/message.service";
import { ConversationService } from "src/conversation/conversation.service";

@Module({
    imports:[UserModule,InformationModule,MessageModule,ConverSationModule,TypeOrmModule.forFeature([User,Information,Message,Conversation]),JwtModule.register({
        secret:process.env.SECRET||null,
        signOptions:{expiresIn:'60m'},
    })],
    providers:[ChatGateway,UserService,MessageService,ConversationService],
    controllers:[],
})
export class GateWayModule{}