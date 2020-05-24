import INotificationsRepository from "@modules/notifications/repositories/INotificationsRepository";
import AppError from "@shared/errors/AppErros";
import { getHours, isBefore, startOfHour, format } from "date-fns";
import { inject, injectable } from "tsyringe";
import { AppointmentEntity } from "../infra/typeorm/entities/Appointment.model";
import IAppointmentsRepository from "../repositories/IAppointmentsRepository";

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
        private notificationsRepository: INotificationsRepository
    ) {}

    public async execute({ provider_id, user_id, date }: IResquestDTO): Promise<AppointmentEntity> {

        const parsedDate = startOfHour(date);

        if(isBefore(parsedDate, Date.now())) 
            throw new AppError("You can't create an appointment on a past date.");

        if(user_id === provider_id)
            throw new AppError("You can't create an appointment with yourself.");
        
        if(getHours(parsedDate) < 8 || getHours(parsedDate) > 17)
            throw new AppError("You can only create appointments between 8am and 5pm.");

        const findAppointInSameDate = await this.appointmentsRepository.findByDate(parsedDate);

        if (findAppointInSameDate)
            throw new AppError("This appointment is already booked");
        
        const appointment = await this.appointmentsRepository.create({ provider_id,user_id, date: parsedDate });

        const dateFormtted = format(parsedDate, "dd/MM/yyyy 'às' HH:mm'h");

        await this.notificationsRepository.create({
            recipient_id: provider_id,
            content: `Novo agendamento para dia ${dateFormtted}`
        });

        return appointment;
    }
}