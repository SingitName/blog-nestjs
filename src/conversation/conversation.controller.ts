import { BadRequestException, Body, Controller, Get, Param, ParseIntPipe, Post, Req, UseGuards } from "@nestjs/common";


import { ConversationService } from "./conversation.service";
import { ApiBearerAuth, ApiBody } from "@nestjs/swagger";
import { AuthGuard } from "src/common/guards/auth.guard";



@Controller('conversation')

@ApiBearerAuth('access-token')
export class ConversationController{
    constructor(
        private readonly conversationService:ConversationService,
    ){}

    @Post('create')
    @UseGuards(AuthGuard) // Sử dụng AuthGuard để bảo vệ route
    async createConversation(
        @Body() createConversationDto: { title: string, userIds: number[] },
        @Req() req: Request, // Lấy thông tin request sau khi guard đã xử lý
    ) {
        const loggedInUserId = req['user'].id; // Lấy thông tin người dùng đã được AuthGuard thêm vào request

        const { title, userIds } = createConversationDto;

        if (!userIds || userIds.length < 1) {
            throw new BadRequestException('Phải chọn ít nhất 1 người dùng để tạo nhóm chat.');
        }

        // Gọi hàm createGroupChat và truyền vào loggedInUserId
        return await this.conversationService.createGroupChat(loggedInUserId, title, userIds);
    }
    @Get(':id')
    async getById(@Param('id') id :number){
        const conversation = await this.conversationService.findById(id);
        return {conversation};
    }
    @Get(':user1Id/:user2Id')
    async getConversationId(
      @Param('user1Id') user1Id: number,
      @Param('user2Id') user2Id: number,
    ) {
      const conversation = await this.conversationService.getOrCreateConversation(user1Id, user2Id);
      return { id: conversation.id };
    }
    
}