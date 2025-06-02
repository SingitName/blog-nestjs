import { Body, Controller, Get, Inject, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { RegisterUserDto } from './dto/register_user.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login_user.dto';
import { AuthGuard } from '@nestjs/passport';
import { GoogleAuthGuard } from './google-auth.guard';
import { Request, Response } from 'express';
import { GoogleStrategy } from './google.strategy';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
    ) {}

    @ApiBody({
        schema: {
            properties: {
                firstName: { type: 'string' },
                lastName: { type: 'string' },
                email: { type: 'string' },
                password: { type: 'string' },
                status: { type: 'number' },
            },
        },
    })
    @Post('register')
    async RegisterUser(@Body() registerUser: RegisterUserDto) {
        const user = await this.authService.register(registerUser);
        return { user };
    }

    @ApiBody({
        schema: {
            properties: {
                email: { type: 'string' },
                password: { type: 'string' },
            },
        },
    })
    @Post('login')
    async LoginUser(@Body() loginUser: LoginUserDto): Promise<any> {
        const user = await this.authService.login(loginUser);
        return { user };
    }
}
