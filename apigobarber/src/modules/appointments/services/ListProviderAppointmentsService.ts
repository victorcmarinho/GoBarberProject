import "reflect-metadata";
import { inject, injectable } from "tsyringe";
import { AppointmentEntity } from "../infra/typeorm/entities/Appointment.model";
import IAppointmentsRepository from "../repositories/IAppointmentsRepository";

interface IRequest {
    provider_id: string;
    day: number;
    month: number;
    year: number;
}



@injectable()
export default class ListProviderAppointmentsService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository
    ) {}

    public async execute({provider_id, day, month, year}: IRequest): Promise<AppointmentEntity[]> {
        const appointments = await this.appointmentsRepository.findAllInDayFromProvider({
            provider_id, 
            day, 
            month, 
            year
        });

        return appointments;

    }
}