// import { Conversation } from "src/conversation/entities/conversation.entity";
// import { User } from "src/user/entities/user.entity";
// import { Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, PrimaryGeneratedColumn, Entity, PrimaryColumn } from "typeorm";

// @Entity({ name: 'user_conversation' })
// export class UserConversation {
  
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ name: 'user_id', nullable: true })
//   user_id: number;

//   @Column({ name: 'conversation_id', nullable: true })
//   conversation_id: number;

//   @Column({ name: 'last_message_id', nullable: true })
//   last_message_id: number;

//   @Column({ name: 'mute', default: false })
//   mute: boolean;

//   @Column({ name: 'block', default: false })
//   block: boolean;

//   @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: true })
//   createdAt: Date;

//   @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
//   updatedAt: Date;

//   @ManyToOne(() => User, (user) => user.userConversation)
//   @JoinColumn({ name: 'user_id' })
//   user?: User;

//   @ManyToOne(
//     () => Conversation,
//     (conversation) => conversation.userConversation,
//   )
//   @JoinColumn({ name: 'conversation_id' })
//   conversation?: Conversation;
// }
