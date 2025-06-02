// src/group/group.controller.ts
import { Body, Controller, Delete, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { GroupService } from './group.service';
import { Group } from './entities/group.entity';
import { Request } from 'express';

@Controller('group')
export class GroupController {
  constructor(private groupService: GroupService) {}
 
  @Get('list')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Lấy danh sách nhóm của người dùng' })
  @ApiResponse({ status: 200, description: 'Danh sách nhóm của người dùng', type: [Group] })
  async listGroups(@Query('loggedInUserId') loggedInUserId: number): Promise<Group[]> {
    return this.groupService.findAllGroups(loggedInUserId);
  }
  @Get('listuser')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({summary:'Hiển thị danh sách member trong group'})
  async listUserGroup(@Query('id') id:number):Promise<Group>{
    return this.groupService.findUserGroup(id);
  }

  @Get('showlist')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('access-token')
  async showGroup():Promise<Group[]>{
    return this.groupService.showAllGroup();
  }


  @UseGuards(AuthGuard)
  @ApiBearerAuth('access-token')
  @ApiBody({
    description: 'Thông tin nhóm cần tạo',
    type: Object,
    examples: {
      example1: {
        value: { groupName: 'Group A', description: 'Description of Group A' },
        summary: 'Ví dụ tạo nhóm A',
      },
    },
  })
  @Post('create')
  async createGroup(@Req() req: Request, @Body() payload: { groupName: string, description: string }) {
    // Vì AuthGuard đã thêm payload vào request (request.user), nên không cần lấy token thủ công nữa
    return this.groupService.createGroup(req.user, payload);
  }
  @UseGuards(AuthGuard)
  @ApiBearerAuth('access-token')
  @Delete('delete')
  async deleteGroup(@Query('id') id :number){
    return this.groupService.deleteGroup(id);
  }



  @UseGuards(AuthGuard)
  @ApiBearerAuth('access-token')
  @ApiBody({
    description: 'Thông tin nhóm và người dùng cần thêm',
    type: Object,
    examples: {
      example1: {
        value: { groupId: 1, userId: 'user123' },
        summary: 'Ví dụ thêm người dùng vào nhóm',
      },
    },
  })
  @Post('addToGroup')
  async addToGroup(@Req() req: Request, @Body() payload: { groupId: number, userId: string }) {
    // Token đã được kiểm tra trong AuthGuard và thông tin user có thể được lấy từ req.user
    return this.groupService.addToGroup(req.user, payload);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth('access-token')
  @Get('members')
  async getGroupUsers(@Query('groupId') groupId: string) {

    return this.groupService.getGroupUsers(groupId);
  }
}
