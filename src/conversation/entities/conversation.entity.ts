import { Message } from "src/messages/entities/message.entity";
import { User } from "src/user/entities/user.entity";
import { PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToMany, JoinTable, Entity } from "typeorm";

@Entity({ name: 'conversations' })
export class Conversation {
    @PrimaryGeneratedColumn()  // Cột tự động tăng duy nhất là id
    id: number;  
    @Column({ name: 'title', nullable: true })
    title: string;

    @Column({ name: 'description', nullable: true, length: 5000 })
    description: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: true })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
    updatedAt: Date;

    @OneToMany(() => Message, (message) => message.conversation)
    messages?: Message[];
    @ManyToMany(() => User, (user) => user.conversations)
    @JoinTable({
      name: 'user_conversation',
      joinColumn: { name: 'conversation_id', referencedColumnName: 'id' },  // Tham chiếu đến 'id' trong bảng Conversation
      inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },   // Tham chiếu đến 'id' trong bảng User
    })
    users: User[];
}
