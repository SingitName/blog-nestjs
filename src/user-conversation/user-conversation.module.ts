import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserConversationService } from "./user-conversation.service";
import { User } from "src/user/entities/user.entity";
import { Conversation } from "src/conversation/entities/conversation.entity";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { UserModule } from "src/user/user.module";

@Module({
    imports: [TypeOrmModule.forFeature([User,Conversation]),
     JwtModule.register({
           global: true,
           secret: '12345',
           signOptions: { expiresIn:'60m' },
         }),UserModule],
     providers: [UserConversationService,JwtService],
     exports: [UserConversationService],
})
export class UserConversationModule{}