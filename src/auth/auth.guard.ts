  import { Injectable } from '@nestjs/common';
  import { CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { Observable } from 'rxjs';

  @Injectable()
  export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

    canActivate(
      context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
      const request = context.switchToHttp().getRequest();
      
      const token = request.headers['authorization']?.split(' ')[1];
      
      if (!token) {
        throw new HttpException('Không có token', HttpStatus.FORBIDDEN);
      }

      try {
        const payload = this.jwtService.verify(token,{secret:process.env.SECRET});
        request.user = payload; 
        return true;
      } catch (error) {
      
        throw new HttpException('Token không hợp lệ', HttpStatus.FORBIDDEN);
      }
    }
  }
