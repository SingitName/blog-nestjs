import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { Message } from 'src/messages/entities/message.entity';
import { Conversation } from 'src/conversation/entities/conversation.entity';

import { Information } from 'src/imformation/entities/imformation.entity';
// import { MessageModule } from 'src/messages/message.module';

@Module({
  imports:[TypeOrmModule.forFeature([User,Message,Conversation,Information]),
  JwtModule.register({
      global:true,
      secret:'12345',
      signOptions:{expiresIn:'1h'},
    }),
  ],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
