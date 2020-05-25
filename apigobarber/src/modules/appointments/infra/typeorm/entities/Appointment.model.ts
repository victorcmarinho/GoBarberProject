import { UserEntity } from "@modules/users/infra/typeorm/entities/UserEntity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export interface IAppointment {
    id: string;
    provider_id: string;
    provider: UserEntity;
    date: Date;
    created_at: Date;
    updated_at: Date;
}

@Entity('appointments')
export class AppointmentEntity implements IAppointment {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    provider_id: string;

    @ManyToOne(() => UserEntity)
    @JoinColumn({name: 'provider_id'})
    provider: UserEntity;

    @Column()
    user_id: string;

    @ManyToOne(() => UserEntity)
    @JoinColumn({name: 'user_id'})
    user: UserEntity;

    @Column('timestamp with time zone')
    date: Date;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

}