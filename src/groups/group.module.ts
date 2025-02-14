// src/group/group.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { Group } from './entities/group.entity';
import { User } from 'src/user/entities/user.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { MessageService } from 'src/messages/message.service';
import { Message } from 'src/messages/entities/message.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Group,User,Message]),
  JwtModule.register({
        global: true,
        secret: '12345',
        signOptions: { expiresIn:'60m' },
      }),UserModule],
  controllers: [GroupController],
  providers: [GroupService,JwtService,MessageService],
  exports: [GroupService],
})
export class GroupModule {}
