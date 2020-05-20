import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, Generated } from "typeorm";


@Entity('user_tokens')
export class UserTokenEntity {


    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @Generated('uuid')
    token: string;
    
    @Column()
    user_id: string;
    
    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

}