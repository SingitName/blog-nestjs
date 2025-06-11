import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create_user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update_user.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

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
    @Get('/group/:id')
    findId(@Param('id') id :number):Promise<User>{
        const response= this.userService.findId(id);
        return response;
    }

    @Post('create-user')
    createUser(@Body() createUserDto:CreateUserDto &{access_token}):Promise<User>{
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
    // @Post(':userId/avatar')
    // @UseInterceptors(FileInterceptor('image'))
    // @ApiConsumes('multipart/form-data')
    // @ApiBody({
    //     schema: {
    //       type: 'object',
    //       properties: {
    //         image: {
    //           type: 'string',
    //           format: 'binary',
    //           description: 'Chọn file từ laptop để upload',
    //         },
    //       },
    //     },
    //   })
    // async updateAvatar(
    //     @Param('userId') userId:number,
    //     @UploadedFile() file:Express.Multer.File,
    // )
    // {
    //     return this.userService.updateAvatar(userId,file);
    // }
  
 }
