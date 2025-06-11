import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';



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
  providers: [UserService],
  exports:[UserService],
})
export class UserModule {}
