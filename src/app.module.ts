import { Module } from '@nestjs/common';
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
})
export class AppModule {}
