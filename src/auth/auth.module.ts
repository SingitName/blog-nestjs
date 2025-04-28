import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import * as session from 'express-session';  
import { GroupService } from 'src/groups/group.service';
import { GroupModule } from 'src/groups/group.module';
import { Group } from 'src/groups/entities/group.entity';
import { Message } from 'src/messages/entities/message.entity';
import { MessageService } from 'src/messages/message.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'google' }),
    TypeOrmModule.forFeature([User,Group,Message]),
    JwtModule.register({
      global: true,
      secret:process.env.SECRET||'12345',
      signOptions: { expiresIn: '1h' },
    }),
    GroupModule,
  ],
  controllers: [AuthController],
  providers: [AuthService,GroupService,MessageService],
  exports:[AuthService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(session({
        secret: '12345', 
        resave: false,
        saveUninitialized: true,
      }))
      .forRoutes('*');  
  }
}
