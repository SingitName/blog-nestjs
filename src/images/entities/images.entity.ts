import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('images')
export class Images{
    @PrimaryGeneratedColumn()
    id:number;
    @Column()
    fileId:string;
    @Column()
    webViewLink:string;
    @Column()
    webContentLink:string;
    @CreateDateColumn({name:'create_at',type:'timestamp',nullable:true})
    createAt:Date;
    @UpdateDateColumn({name:'update_at',type:'timestamp',nullable:true})
    updateAt:Date;
    @ManyToOne(()=>User,(user) => user.images,{
        onDelete:'CASCADE',
    })
        user:User;

}