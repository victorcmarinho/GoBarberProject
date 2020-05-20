import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserModel } from "./User.model";

export interface IAppointment {
    id: string;
    provider_id: string;
    provider: UserModel;
    date: Date;
    created_at: Date;
    updated_at: Date;
}

@Entity('appointments')
export class AppointmentModel implements IAppointment {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    provider_id: string;

    @ManyToOne(() => UserModel)
    @JoinColumn({name: 'provider_id'})
    provider: UserModel;

    @Column('timestamp with time zone')
    date: Date;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

}