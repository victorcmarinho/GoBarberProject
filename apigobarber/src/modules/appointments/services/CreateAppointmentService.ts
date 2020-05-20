import AppError from "@shared/errors/AppErros";
import { startOfHour, isBefore, getHours } from "date-fns";
import { AppointmentEntity } from "../infra/typeorm/entities/Appointment.model";
import IAppointmentsRepository from "../repositories/IAppointmentsRepository";
import { inject, injectable } from "tsyringe";

interface IResquestDTO {
    provider_id: string;
    user_id: string;
    date: Date;
}

@injectable()
export default class CreateAppointmentService {

    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository
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

        
        return appointment;
    }
}