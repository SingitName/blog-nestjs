import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { GoogleService } from './google.service';
import { GoogleController } from './google.controller';

@Module({
    imports:[JwtModule.register({
        secret:process.env.SECRET,
        signOptions:{expiresIn:'60m'}
    }),
    UserModule,
],
    providers:[GoogleService],
    controllers:[GoogleController],
})
export class GoogleModule {}
