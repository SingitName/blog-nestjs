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

import { MessageService } from './message.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Message } from './entities/message.entity';
  
  @UseGuards(AuthGuard)
  @ApiBearerAuth('access-token')
  @Controller('messages')
  export class MessagesController {
    constructor(private readonly messageService: MessageService) {}
    @Get('conversation/:conversationId')
  async getMessagesByConversationId(
    @Param('conversationId') conversationId: number,
  ): Promise<Message[]> {
    return await this.messageService.getMessagesByConversationId(conversationId);
  }
  // Lấy tin nhắn theo userId
  @Get('user/:userId')
  async getMessagesByUserId(@Param('userId') userId: number): Promise<Message[]> {
    return await this.messageService.getMessagesByUserId(userId);
  }
  
  }