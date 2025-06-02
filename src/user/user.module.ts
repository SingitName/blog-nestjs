import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { Message } from 'src/messages/entities/message.entity';
import { Conversation } from 'src/conversation/entities/conversation.entity';

import { Information } from 'src/imformation/entities/imformation.entity';
import { GoogleService } from 'src/google/google/google.service';
import { Images } from 'src/images/entities/images.entity';
import { ImagesService } from 'src/images/images.service';


// import { MessageModule } from 'src/messages/message.module';

@Module({
  imports:[TypeOrmModule.forFeature([User,Message,Conversation,Information,Images]),
  JwtModule.register({
      global:true,
      secret:process.env.SECRET,
      signOptions:{expiresIn:'3d'},
    }),
  ],
  controllers: [UserController],
  providers: [UserService,GoogleService,ImagesService],
  exports:[UserService],
})
export class UserModule {}
