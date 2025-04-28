import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from 'src/messages/entities/message.entity'; 

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  // Phương thức lưu tin nhắn
  async saveMessage(messageData: { conversation_id: number; user_id: number; message: string }): Promise<Message> {
    const { conversation_id, user_id, message } = messageData;

    const newMessage = this.messageRepository.create({
      conversation: { id: conversation_id },
      user: { id: user_id },
      message: message,
    });
    return this.messageRepository.save(newMessage);
  }
  // Phương thức lấy tất cả tin nhắn trong một cuộc trò chuyện
  async getMessagesByConversationId(conversationId: number): Promise<Message[]> {
    return await this.messageRepository.find({
      where: { conversation_id: conversationId },
      relations: ['user'], // Liên kết với entity User để lấy thông tin người gửi
      order: { createdAt: 'ASC' }, // Sắp xếp tin nhắn theo thứ tự thời gian
    });
  }

  // Lấy tất cả tin nhắn của một người dùng cụ thể trong cuộc trò chuyện
  async getMessagesByUserId(userId: number): Promise<Message[]> {
    return await this.messageRepository.find({
      where: { user_id: userId },
      relations: ['conversation', 'user'],
      order: { createdAt: 'ASC' },
    });
  }

}
