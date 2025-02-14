import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { TypeInformation } from "../interface/information.interface";

@Entity({name:'information'})
export class Information {
    @PrimaryGeneratedColumn()
    id:string;
    @Column({ name: 'user_id', nullable: true })
    user_id: number | string;

    @Column({ name: 'status', default: false })
    status: boolean;
    @Column({ name: 'type' })
    type: TypeInformation;
    @Column({ name: 'value', length: 255 })
    value: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: true })
    createdAt: Date;
    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
    updatedAt: Date;

    @ManyToOne(() => User, (user) => user.messages)
    @JoinColumn({ name: 'user_id' })
    user?: User;
}