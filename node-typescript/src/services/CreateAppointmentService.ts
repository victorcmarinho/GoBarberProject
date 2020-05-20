import { startOfHour } from "date-fns";
import { getCustomRepository } from "typeorm";
import AppError from "../errors/AppErros";
import { AppointmentModel } from "../models/Appointment.model";
import AppointmentsRepository from "../repositories/AppointmentsRepository";

interface ResquestDTO {
    provider_id: string;
    date: Date;
}

export default class CreateAppointmentService {

    public async execute({ provider_id, date }: ResquestDTO): Promise<AppointmentModel> {

        const appointmentsRepository = getCustomRepository(AppointmentsRepository);

        const parsedDate = startOfHour(date);

        const findAppointInSameDate = await appointmentsRepository.findByDate(parsedDate);

        if (findAppointInSameDate) {
            throw new AppError("This appointment is already booked");
        }

        const appointment = appointmentsRepository.create({ provider_id, date: parsedDate });

        await appointmentsRepository.save(appointment);
        
        return appointment;
    }
}