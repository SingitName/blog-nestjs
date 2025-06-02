// src/group/entities/group.entity.ts
import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  creatorId: number;  // ID của người tạo nhóm

  @ManyToMany(() => User)  // Mối quan hệ ManyToMany với User
  @JoinTable()  // Bảng kết nối giữa Group và User
  members: User[]
}
