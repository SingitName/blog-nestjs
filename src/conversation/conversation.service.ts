import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
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
    private conversationRepository: Repository<Conversation>,

    private userService: UserService,
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
    const conversation = await this.conversationRepository.findOne({ where: { id } });
    if (!conversation) {
      throw new BadRequestException('Conversation not found');
    }
    return conversation;
  }

  async createGroupChat(loggedInUserId: number, title: string, userIds: number[] = []): Promise<Conversation> {
    // Đảm bảo rằng người dùng đã login sẽ là thành viên trong nhóm
    if (!userIds.includes(loggedInUserId)) {
        userIds.push(loggedInUserId);
    }

    // Kiểm tra danh sách người dùng có hợp lệ không
    const users = await this.userService.findUsersByIds(userIds);
    if (!users.length) {
        throw new BadRequestException('No users found');
    }

    // Tạo đối tượng nhóm chat và đặt người dùng đã đăng nhập làm chủ phòng (nếu cần)
    const newConversation = this.conversationRepository.create({  // Sử dụng create từ repository
        title,
        users,
        isGroup: true,  // Đánh dấu đây là nhóm chat
        createdAt: new Date(),
        updatedAt: new Date(),
        // ownerId: loggedInUserId, // Loại bỏ nếu Conversation không có ownerId
    });

    // Lưu nhóm chat vào database
    return await this.conversationRepository.save(newConversation);
}

  async getOrCreateConversation(user1Id: number, user2Id: number): Promise<Conversation> {
    // Lấy thông tin hai người dùng
    const user1 = await this.userService.findOne({ where: { id: user1Id } });
    const user2 = await this.userService.findOne({ where: { id: user2Id } });

    if (!user1 || !user2) {
      throw new BadRequestException('One or both users not found');
    }

    const [firstUserId, secondUserId] =
      user1Id < user2Id ? [user1Id, user2Id] : [user2Id, user1Id];

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
  async getUsersInConversation(conversationId: number): Promise<User[]> {
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId },
      relations: ['users'],  // Liên kết với bảng users để lấy danh sách người dùng
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return conversation.users;  // Trả về danh sách người dùng
  }
}

