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

  @Column()
  email: string;

  @Column()
  password: string;
<<<<<<< HEAD
<<<<<<< HEAD

=======
=======
=======
<<<<<<< HEAD

=======
>>>>>>> 285d1b4 (hoxfit:update)
>>>>>>> f010524 (fix:cherry pick)
  @Column({
    type:'enum',
    enum:UserRole,
    default:UserRole.USER,
  })
  role:UserRole;
  @Column()
<<<<<<< HEAD
>>>>>>> d75148b (fix:update-2)
=======
<<<<<<< HEAD
=======
>>>>>>> d75148b (fix:update-2)
>>>>>>> 285d1b4 (hoxfit:update)
>>>>>>> f010524 (fix:cherry pick)
  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  updatedAt: Date;

  @Column()
  refesh_token: string;

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
