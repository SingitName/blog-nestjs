import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Video {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  video_name: string;

  @Column()
  mime_type: string;

  @Column()
  file_id: string;

  @Column({ nullable: true })
  web_view_link: string;

  @Column({ nullable: true })
  web_content_link: string;

  @CreateDateColumn()
  created_at: Date;
}
