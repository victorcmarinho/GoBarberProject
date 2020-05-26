import "reflect-metadata";
import { inject, injectable } from "tsyringe";
import { AppointmentEntity } from "../infra/typeorm/entities/Appointment.model";
import IAppointmentsRepository from "../repositories/IAppointmentsRepository";
import ICacheProvider from "@shared/container/providers/CacheProvider/models/ICacheProvider";

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
        private appointmentsRepository: IAppointmentsRepository,
        
        @inject('CacheProvider')
        private cacheProvider: ICacheProvider
    ) {}

    public async execute({provider_id, day, month, year}: IRequest): Promise<AppointmentEntity[]> {

        const cacheKey = `provider-appointments:${provider_id}:${year}-${month}-${day}`

        let appointments = await this.cacheProvider.recover<AppointmentEntity[]>(cacheKey);
        
        if(!appointments) {

            appointments = await this.appointmentsRepository.findAllInDayFromProvider({
                provider_id, 
                day, 
                month, 
                year
            });
    
            await this.cacheProvider.save(cacheKey, appointments)
        }


        return appointments;

    }
}