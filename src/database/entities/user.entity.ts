import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id:string;
    @Column()
    email:string;
    @Column({select:false})
    password:string;
    @Column({nullable:true})
    avatar:string;
    @Column({nullable:true})
    firstName:string;
    @Column({nullable:true})
    lastName:string;
}