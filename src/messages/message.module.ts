// src/group/group.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { Message } from './entities/message.entity';
import { MessageService } from './message.service';
import { Conversation } from 'src/conversation/entities/conversation.entity';
import { MessagesController } from './message.controller';


@Module({
  imports: [TypeOrmModule.forFeature([Message,User,Conversation]),
  JwtModule.register({
        global: true,
        secret: '12345',
        signOptions: { expiresIn:'60m' },
      }),UserModule],
  providers: [MessageService,JwtService],
  exports: [MessageService],
  controllers:[MessagesController],
})
export class MessageModule {}
