import { Module } from '@nestjs/common';
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
})
export class AppModule {}
