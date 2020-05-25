import { Exclude, Expose } from 'class-transformer';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import uploadConfig from '@config/upload';
export interface IUser {
    id: string;
    name: string;
    email: string;
    password: string;
    created_at: Date;
    updated_at: Date;
}

@Entity('users')
export class UserEntity implements IUser {


    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;
    
    @Column()
    email: string;

    @Column()
    @Exclude()
    password: string;

    @Column()
    avatar: string;
    
    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @Expose({name: 'avatar_url'})
    getAvatarUrl(): string | null {
        if(!this.avatar)
            return null;
        switch(uploadConfig.driver) {
            case 'disk':
                return `${process.env.APP_API_URL}/files/${this.avatar}`;
            case 's3':
                return `https://${uploadConfig.config.aws.bucket}.s3-sa-east-1.amazonaws.com/${this.avatar}`;
            default:
                return null;

        }
    }

}