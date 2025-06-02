import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'database/data-source';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { GroupModule } from './groups/group.module';
import { GoogleController } from './google/google/google.controller';
import { GoogleService } from './google/google/google.service';
import { GoogleModule } from './google/google/google.module';
import { GateWayModule } from './gateway/gateway.module';
import { MessageModule } from './messages/message.module';

import { InformationModule } from './imformation/information.module';

@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions),
    UserModule,
    AuthModule,ConfigModule.forRoot({
      isGlobal:true,
    }),
    GoogleModule,GateWayModule,
    MessageModule,
    InformationModule,
  ],
  controllers: [GoogleController],
  providers: [GoogleService],
})
export class AppModule {}
