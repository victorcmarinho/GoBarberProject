import ICreateAppointmentDTO from "@modules/appointments/dtos/ICreateAppointmentDTO";
import IFindAllInDayFromProviderDTO from "@modules/appointments/dtos/IFindAllInDayFromProviderDTO";
import IFindAllInMonthFromProviderDTO from "@modules/appointments/dtos/IFindAllInMonthFromProviderDTO";
import { AppointmentEntity } from "@modules/appointments/infra/typeorm/entities/Appointment.model";
import IAppointmentsRepository from "@modules/appointments/repositories/IAppointmentsRepository";
import { getDate, getMonth, getYear, isEqual } from "date-fns";
import { uuid } from 'uuidv4';
export default class FakeAppointmentsRepository implements IAppointmentsRepository{

    private appointment: AppointmentEntity[] = [];

    async create({provider_id, date}: ICreateAppointmentDTO): Promise<AppointmentEntity> {
        const appointment = new AppointmentEntity();

        Object.assign(appointment,{id: uuid, provider_id, date});

        this.appointment.push(appointment);

        return appointment;
    }

    public async findByDate(date: Date): Promise<AppointmentEntity | undefined> {
        return this.appointment.find(appointment => isEqual(appointment.date,date));
    }

    async findAllInMonthFromProvider({provider_id, month, year}: IFindAllInMonthFromProviderDTO): Promise<AppointmentEntity[]> {
        return this.appointment.filter(appointment => 
            appointment.provider_id === provider_id &&
            getMonth(appointment.date) + 1 === month &&
            getYear(appointment.date) === year
        );
    }

    async findAllInDayFromProvider({provider_id, day, month, year}: IFindAllInDayFromProviderDTO): Promise<AppointmentEntity[]> {
        return this.appointment.filter(appointment => 
            appointment.provider_id === provider_id &&
            getDate(appointment.date) === day &&
            getMonth(appointment.date) + 1 === month &&
            getYear(appointment.date) === year
        );
    }

}