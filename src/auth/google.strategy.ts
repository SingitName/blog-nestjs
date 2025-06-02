import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { AuthService } from './auth.service';
import { OAuth2Client } from 'google-auth-library'; 
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); 
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID, 
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `http://localhost:5000/auth/google/callback`,
      scope: ['profile', 'email'],
    });
  }
  async validateToken(token: string) {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload(); 
      if (payload) {
        return {
          email: payload.email,
          firstName: payload.given_name,
          lastName: payload.family_name,
        };
      }
      return null;
    } catch (err) {
      throw new Error('Token verification failed');
    }
  }

  // Phương thức validate trong PassportStrategy
  async validate(accessToken: string, refreshToken: string, profile: any) {
    const user = this.authService.validateUser(profile);
    return user;
  }
}

