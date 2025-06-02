import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Conversation } from "./entities/conversation.entity";
import { Message } from "src/messages/entities/message.entity";
import { User } from "src/user/entities/user.entity";
import { UserModule } from "src/user/user.module";
import { MessageModule } from "src/messages/message.module";
import { ConfigModule } from "@nestjs/config";
import { ConversationService } from "./conversation.service";
import { ConversationController } from "./conversation.controller";
import { JwtModule } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";

@Module({
    imports:[ConfigModule,TypeOrmModule.forFeature([Conversation,Message,User]),
    JwtModule.register({
        global:true,
        secret:process.env.SECRET,
        signOptions:{expiresIn:'60m'},
    })
    ,UserModule,MessageModule],
    providers:[ConversationService,ConfigModule,UserService],
    controllers:[ConversationController],
    exports:[ConversationService],
})
export class ConverSationModule{}