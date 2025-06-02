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

  // Thêm các phương thức khác nếu cần thiết như tìm kiếm tin nhắn, xóa tin nhắn, v.v.
  async saveMessage(messageData: { conversation_id: number; user_id: number; message: string }): Promise<Message> {
    const { conversation_id, user_id, message } = messageData;

    // Tạo đối tượng message mới từ dữ liệu đầu vào
    const newMessage = this.messageRepository.create({
      conversation: { id: conversation_id }, // Liên kết với cuộc trò chuyện
      user: { id: user_id },                 // Liên kết với người dùng
      message: message,                      // Nội dung tin nhắn               // Thời gian tạo tin nhắn
    });
    return this.messageRepository.save(newMessage);
  }
  async getMessagesByConversationId(conversation_id: number): Promise<Message[]> {
    return await this.messageRepository.find({
      where: { conversation: { id: conversation_id } }, // Tìm tất cả tin nhắn trong cuộc trò chuyện
      order: { createdAt: 'ASC' },  // Sắp xếp theo thời gian tạo, nếu bạn có cột createdAt
    });
  }
}
