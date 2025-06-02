import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.guard";
import { CreateDto } from "./dto/createdto.dto";
import { ConversationService } from "./conversation.service";
import { ApiBearerAuth, ApiBody } from "@nestjs/swagger";


@Controller('conversation')
@UseGuards(AuthGuard)
@ApiBearerAuth('access-token')
export class ConversationController{
    constructor(
        private readonly conversationService:ConversationService,
    ){}
    @Post('create')
    @ApiBody({
        schema:{
            properties:{
                title:{type:'string'},
                description:{type:'string'},
            }
        }
    })
    async CreateConversation(@Body()createConversationDto:CreateDto){
        return await this.conversationService.create(createConversationDto);
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