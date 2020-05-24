import { ObjectID, Entity, CreateDateColumn, UpdateDateColumn, Column, ObjectIdColumn } from 'typeorm';

@Entity('notifications')
export default class NotificationEntity {

    @ObjectIdColumn()
    id: ObjectID;

    @Column()
    content: string;

    @Column('uuid')
    recipient_id: string;
    
    @Column({ default: false})
    read: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

}