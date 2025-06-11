import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import * as session from 'express-session';  
import { Message } from 'src/messages/entities/message.entity';
import { MessageService } from 'src/messages/message.service';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'google' }),
    TypeOrmModule.forFeature([User,Message]),
    JwtModule.register({
      global: true,
      secret:process.env.SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService,MessageService],
  exports:[AuthService],
})
export class AuthModule {}
