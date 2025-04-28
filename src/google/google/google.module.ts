import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { GoogleService } from './google.service';
import { GoogleController } from './google.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { ImagesService } from 'src/images/images.service';
import { Images } from 'src/images/entities/images.entity';
import { ConfigModule } from '@nestjs/config';
import { GoogleStrategy } from './google.strategy';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports:[TypeOrmModule.forFeature([Images,User]),
    JwtModule.register({
        secret:process.env.SECRET,
        signOptions:{expiresIn:'60m'}
    }),
    ConfigModule.forRoot({
        isGlobal:true,
    }),
    UserModule,AuthModule,
],
    providers:[GoogleService,ImagesService,GoogleStrategy],
    controllers:[GoogleController],
    exports:[GoogleService],
})
export class GoogleModule {}
