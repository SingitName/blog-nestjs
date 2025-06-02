import { Socket, Server } from 'socket.io';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { User } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { InformationService } from 'src/imformation/information.service';
import { SaveInformationDto } from 'src/imformation/dto/save.dto';
import { TypeInformation } from 'src/imformation/interface/information.interface';
import { ConversationService } from 'src/conversation/conversation.service';
import { MessageService } from 'src/messages/message.service';
import { CreateMessage } from 'src/messages/interfaces/message.interface';

@WebSocketGateway({
  cors: true,
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly informationService: InformationService,
    private readonly conversationService: ConversationService,
    private readonly messageService: MessageService,
  ) {}

  afterInit(server: any) {
    console.log("WebSocket initialized");
  }

  async handleConnection(client: Socket) {
    const user: User = await this.getDataUserFromToken(client);
    if (!user) return;
    console.log("Client connected:", user.email);

    const information: SaveInformationDto = {
      user_id: user.id,
      type: TypeInformation.socket_id,
      status: false,
      value: client.id,
    };
    await this.informationService.create(information);
  }

  async handleDisconnect(client: Socket) {
    const user = await this.getDataUserFromToken(client);
    if (!user) return;
    await this.informationService.deleteValue(user.id, client.id);
    console.log("Client disconnected:", client.id);
  }

  @SubscribeMessage('messages')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() messageData: { conversationId: number; message: string },
  ) {
    const user: User = await this.getDataUserFromToken(client);
    if (!user) return;
  
    const conversation = await this.conversationService.findById(messageData.conversationId);
    if (!conversation) {
      return { error: 'Conversation not found' };
    }
  
    const newMessage: CreateMessage = {
      conversation_id: messageData.conversationId,
      user_id: user.id,
      message: messageData.message,
      status: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const savedMessage = await this.messageService.saveMessage(newMessage);
  
    this.server.to(`conversation_${messageData.conversationId}`).emit('receiveMessage', {
      conversationId: messageData.conversationId,
      message: savedMessage.message,
      userId: savedMessage.user_id,
      createdAt: savedMessage.createdAt,
    });
  }
  
  @SubscribeMessage('joinConversation')
  async handleJoinConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() conversationId: number,
  ) {
    const user: User = await this.getDataUserFromToken(client);
    if (!user) return;
  
    const conversation = await this.conversationService.findById(conversationId);
    if (!conversation) {
      return { error: 'Conversation not found' };
    }
  
    client.join(`conversation_${conversationId}`);
    console.log(`User ${user.email} joined conversation ${conversationId}`);
  }
  @SubscribeMessage('leaveConversation')
  async handleLeaveConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() conversationId: number,
  ) {
    const user: User = await this.getDataUserFromToken(client);
    if (!user) return;

    client.leave(`conversation_${conversationId}`);
    console.log(`User ${user.email} left conversation ${conversationId}`);
  }

  async getDataUserFromToken(client: Socket): Promise<User> {
    const authToken = client.handshake?.auth?.token;
    try {
      const decoded = this.jwtService.verify(authToken, {
        secret: process.env.SECRET,
      });
      return await this.userService.getUserByEmail(decoded.email);
    } catch (error) {
      console.error("Token validation error:", error);
      return null;
    }
  }
}