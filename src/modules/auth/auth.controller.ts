import { Body, Controller, Post} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './auth.dto';


@ApiTags('Auth')
@Controller('api/auth')

export class AuthController {
    constructor(
        private authService: AuthService,
    ) {}
    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    async RegisterUser(@Body() registerUser: RegisterUserDto) {
        return await this.authService.Register(registerUser);
    }
}
