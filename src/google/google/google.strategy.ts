import { Injectable } from "@nestjs/common"; 
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-google-oauth20';
import { AuthService } from "src/auth/auth.service"; // Sử dụng AuthService thay vì UserService
import { User } from "src/user/entities/user.entity";
import { UserService } from "src/user/user.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        private configService: ConfigService,
        private authService: AuthService, // Sử dụng AuthService thay vì UserService
       private userService :UserService, // Inject AuthService thay vì UserService
    ) {
        super({
            clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
            clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
            callbackURL: "http://localhost:5000/google/googles/callback",
            scope: ['email', 'profile'],
        });
    }
    async validate(accessToken: string, refreshToken: string, profile: any, done: Function): Promise<any> {
      try {
          const { name, emails, photos } = profile;
          const email = emails[0].value;
          
          // Kiểm tra xem email đã tồn tại trong cơ sở dữ liệu chưa
          let user: User = await this.userService.getUserByEmail(email);
          
          if (!user) {
              // Nếu người dùng chưa tồn tại, trả về thông tin để chuyển hướng tới trang đăng ký
              const userInfo = {
                  email,
                  firstName: name.givenName,
                  lastName: name.familyName,
                  avatar: photos[0]?.value || null, // Lấy avatar từ Google
              };

              return done(null, { user: null, userInfo }); 
          }

          // Nếu người dùng đã tồn tại, tạo JWT token
          const payload = { id: user.id,firstName:user.firstName,lastName:user.lastName, email: user.email, avatar: user.avatar, role: user.role };
          const tokens = await this.authService.generateToken(payload);

          // Trả về người dùng và token
          return done(null, { user, tokens });
      } catch (err) {
          console.error('Lỗi trong quá trình xác thực Google:', err);
          return done(err, null);
      }
  }
}
