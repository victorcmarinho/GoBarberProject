import INotificationsRepository from "@modules/notifications/repositories/INotificationsRepository";
import AppError from "@shared/errors/AppErros";
import { format, getHours, isBefore, startOfHour } from "date-fns";
import { inject, injectable } from "tsyringe";
import { AppointmentEntity } from "../infra/typeorm/entities/Appointment.model";
import IAppointmentsRepository from "../repositories/IAppointmentsRepository";
import ICacheProvider from "@shared/container/providers/CacheProvider/models/ICacheProvider";

interface IResquestDTO {
    provider_id: string;
    user_id: string;
    date: Date;
}

@injectable()
export default class CreateAppointmentService {

    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository,

        @inject('NotificationsRepository')
        private notificationsRepository: INotificationsRepository,

        @inject('CacheProvider')
        private cacheProvider: ICacheProvider
    ) {}

    public async execute({ provider_id, user_id, date }: IResquestDTO): Promise<AppointmentEntity> {

        const appointmentDate = startOfHour(date);

        if(isBefore(appointmentDate, Date.now())) 
            throw new AppError("You can't create an appointment on a past date.");

        if(user_id === provider_id)
            throw new AppError("You can't create an appointment with yourself.");
        
        if(getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17)
            throw new AppError("You can only create appointments between 8am and 5pm.");

        const findAppointInSameDate = await this.appointmentsRepository.findByDate(appointmentDate, provider_id);

        if (findAppointInSameDate)
            throw new AppError("This appointment is already booked");
        
        const appointment = await this.appointmentsRepository.create({ provider_id,user_id, date: appointmentDate });

        const dateFormtted = format(appointmentDate, "dd/MM/yyyy 'às' HH:mm'h");

        await this.notificationsRepository.create({
            recipient_id: provider_id,
            content: `Novo agendamento para dia ${dateFormtted}`
        });

        await this.cacheProvider.invalidate(`provider-appointments:${provider_id}:${format(appointmentDate, 'yyyy-M-d')}`)

        return appointment;
    }
}