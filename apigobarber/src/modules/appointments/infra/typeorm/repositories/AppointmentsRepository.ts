import ICreateAppointmentDTO from "@modules/appointments/dtos/ICreateAppointmentDTO";
import IFindAllInDayFromProviderDTO from "@modules/appointments/dtos/IFindAllInDayFromProviderDTO";
import IFindAllInMonthFromProviderDTO from "@modules/appointments/dtos/IFindAllInMonthFromProviderDTO";
import IAppointmentsRepository from "@modules/appointments/repositories/IAppointmentsRepository";
import { getRepository, Raw, Repository } from "typeorm";
import { AppointmentEntity } from "../entities/Appointment.model";

export default class AppointmentsRepository implements IAppointmentsRepository{

    private ormRepository: Repository<AppointmentEntity>;

    constructor() {
        this.ormRepository = getRepository(AppointmentEntity);
    }

    async create({provider_id, date, user_id}: ICreateAppointmentDTO): Promise<AppointmentEntity> {
        const appointment = this.ormRepository.create({provider_id,user_id, date});
        await this.ormRepository.save(appointment);
        return appointment;
    }

    public async findByDate(date: Date, provider_id: string): Promise<AppointmentEntity | undefined> {
        const findAppointment = await this.ormRepository.findOne({
            where: { date, provider_id },
        });
        return findAppointment;
        
    }

    async findAllInMonthFromProvider({provider_id, month, year}: IFindAllInMonthFromProviderDTO): Promise<AppointmentEntity[]> {
        
        const parsedMonth = String(month).padStart(2, '0');


        const appointments = await this.ormRepository.find({
            where: {
                provider_id,
                date: Raw(dateFieldName => 
                    `
                        to_char(${dateFieldName}, 'MM-YYYY') = '${parsedMonth}-${year}'
                    `
                )
            }
        });

        return appointments;
    }

    async findAllInDayFromProvider({provider_id, day, month, year}: IFindAllInDayFromProviderDTO): Promise<AppointmentEntity[]> {

        const parsedDay = String(day).padStart(2, '0');
        const parsedMonth = String(month).padStart(2, '0');

        const appointments = await this.ormRepository.find({
            where: {
                provider_id,
                date: Raw(dateFieldName => 
                    `
                        to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'
                    `
                )
            }
        });

        return appointments;

    }


}