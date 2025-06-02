import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Conversation } from "./entities/conversation.entity";
import { Repository } from "typeorm";
import { User } from "src/user/entities/user.entity";
import { CreateDto } from "./dto/createdto.dto";
import { UserService } from "src/user/user.service";

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation | null>,
    
    private userService :UserService,
  ) {}

  async create(createConversationDto: CreateDto): Promise<Conversation> {
    const newConversation = this.conversationRepository.create({
      title: createConversationDto.title,
      description: createConversationDto.description,
      createdAt: new Date(), // Tự động thêm thời gian tạo mới
      updatedAt: new Date(), // Tự động thêm thời gian cập nhật
    });

    return await this.conversationRepository.save(newConversation);
  }

  async findById(id: number): Promise<Conversation> {
    return this.conversationRepository.findOne({ where: { id } });
  }

  async getOrCreateConversation(user1Id: number, user2Id: number): Promise<Conversation> {
    // Lấy thông tin hai người dùng
    const user1 = await this.userService.findOne({ where: { id: user1Id } });
    const user2 = await this.userService.findOne({ where: { id: user2Id } });

    if (!user1 || !user2) {
      throw new Error('Không tìm thấy người dùng');
    }

    const [firstUserId, secondUserId] = user1Id < user2Id ? [user1Id, user2Id] : [user2Id, user1Id];

    // Tìm kiếm cuộc trò chuyện giữa hai người dùng
    const conversation = await this.conversationRepository
      .createQueryBuilder('conversation')
      .innerJoin('conversation.users', 'user1')
      .innerJoin('conversation.users', 'user2')
      .where('user1.id = :firstUserId', { firstUserId })
      .andWhere('user2.id = :secondUserId', { secondUserId })
      .groupBy('conversation.id')
      .having('COUNT(conversation.id) = 1') // Đảm bảo chỉ có hai người dùng trong cuộc trò chuyện
      .getOne();

    // Nếu không tìm thấy, tạo cuộc trò chuyện mới
    if (!conversation) {
      const newConversation = this.conversationRepository.create({
        title: '',
        description: '',
        users: [user1, user2],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return await this.conversationRepository.save(newConversation);
    }

    return conversation;
  }
}
