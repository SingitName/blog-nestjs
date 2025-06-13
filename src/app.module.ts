import { Module } from '@nestjs/common';
<<<<<<< HEAD
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'database/data-source';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { GoogleModule } from './google/google/google.module';
import { InformationModule } from './imformation/information.module';
import { ImagesModule } from './images/images.module';
import { GateWayModule } from './gateway/gateway.module';
import { VideoModule } from './videos/videos.module';

@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions),
    UserModule,
    AuthModule,ConfigModule.forRoot({
      isGlobal:true,
    }),
    InformationModule,
    GoogleModule,
    GateWayModule,
    VideoModule,
  ],
=======
import { UserModule } from './modules/user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';

@Module({
    imports:[
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
      ...require('../ormconfig.json'),
      autoLoadEntities: true,
    }),
        UserModule,
        AuthModule,
    ],
    providers:[]
>>>>>>> bdd37fd (wip:begin login)
})
export class AppModule {}
