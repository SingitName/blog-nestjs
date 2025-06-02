import {
    Get,
    Put,
    Post,
    Body,
    Delete,
    Param,
    Controller,
    Query,
    HttpException,
    HttpStatus,
    UseGuards,
  } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { MessageService } from './message.service';
import { ApiBearerAuth } from '@nestjs/swagger';
  
  @UseGuards(AuthGuard)
  @ApiBearerAuth('access-token')
  @Controller('messages')
  export class MessagesController {
    constructor(private readonly messageService: MessageService) {}
    @Get(':id')
    async getMessagesByConversationId(@Param('id') id: number) {
    try {
      const result = await this.messageService.getMessagesByConversationId(id);
      const filteredResult = result.map((message) => ({
        user_id: message.user_id,
        message: message.message,
      }));
      return { filteredResult };  // Trả về kết quả trực tiếp
    } catch (error) {
      throw new HttpException('Lỗi khi lấy tin nhắn', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  }