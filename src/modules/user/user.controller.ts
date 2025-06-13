import { IsEmail } from 'class-validator';

import { Body, Controller, Get, Query } from "@nestjs/common";
import { UserService } from "./user.service";
import { ApiBearerAuth } from '@nestjs/swagger';
@ApiBearerAuth()
@Controller('api/user')
export class UserController{
    constructor(
        private userService:UserService,
    ){}
    @Get()
    async findByEmail(@Query('email') email: string) {
    return await this.userService.findByEmail(email);
    }
}