import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { UserModule } from '../user/user.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret:process.env.SECRET,
      signOptions:{expiresIn:process.env.JWT_EXPIRES_IN}
    }),

    UserModule,

  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports:[AuthService],
})
export class AuthModule {}
