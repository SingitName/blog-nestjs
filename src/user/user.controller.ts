import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create_user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateUserDto } from './dto/update_user.dto';
import { DeleteResult, UpdateResult } from 'typeorm';

@Controller('user')
@UseGuards(AuthGuard)
@ApiBearerAuth('access-token')
export class UserController {
    constructor(private userService :UserService){}
    @Get('all_list')
    async allListUser(){
        return this.userService.findAllId();
    }
    @Get('list')
       async ListUser(@Query('loggedInUserId') loggedInUserId: number){
           return this.userService.findAll(loggedInUserId);
       }
    @Get('/find/:id')
    findId(@Param('id') id :number):Promise<User>{
        const response= this.userService.findId(id);
        return response;
    }

    @Post('create-user')
    @ApiBody({
        schema:{
            properties:{
                firstName:{type:'string'},
                lastName:{type:'string'},
                email:{type:'string'},
                password:{type:'string'},
                status:{type:'number'},
            }
        }
    })
    createUser(@Body() createUserDto:CreateUserDto):Promise<User>{
        return this.userService.create(createUserDto);

    }
    @Put('/update/:id')
    @ApiBody({
        schema:{
            properties:{
                firstName:{type:'string'},
                lastName:{type:'string'},
                email:{type:'string'},
                status:{type:'string'},
            }
        }
    })
    updateUser(@Param('id') id:number,@Body() userUpdateDto:UpdateUserDto):Promise<UpdateResult>{
        return this.userService.update(id,userUpdateDto);
    }
    @Delete('/delete/:id')
    delete(@Param('id') id :number):Promise<DeleteResult>{
        return this.userService.delete(id);
    }
 }
