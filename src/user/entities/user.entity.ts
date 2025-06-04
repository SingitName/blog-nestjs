import { Conversation } from 'src/conversation/entities/conversation.entity';
import { Group } from 'src/groups/entities/group.entity';
import { Information } from 'src/imformation/entities/imformation.entity';
import { Message } from 'src/messages/entities/message.entity';
// import { UserConversation } from 'src/user-conversation/entities/user-conversation.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, CreateDateColumn, UpdateDateColumn, OneToMany, JoinTable } from 'typeorm';

@Entity({name:'users'})
export class User {
  @PrimaryGeneratedColumn()  // Cột tự động tăng duy nhất
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({nullable: true})
  avatar: string;
  @Column()
  email: string;
  @Column()
  password: string;

  @Column()
  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  updatedAt: Date;

  @Column({ default: 1 })
  status: number;
  
  @OneToMany(() => Information, (information) => information.user, {
    eager: true,
  })
  information?: Information[];
  @ManyToMany(() => Group, (group) => group.members)
  groups: Group[];

  @OneToMany(() => Message, (message) => message.user)
  messages?: Message[];
  @ManyToMany(() => Conversation, (conversation) => conversation.users)
  conversations: Conversation[];
}
