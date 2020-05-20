import IAppointmentsRepository from "@modules/appointments/repositories/IAppointmentsRepository";
import ICreateAppointmentDTO from "@modules/appointments/dtos/ICreateAppointmentDTO";
import { AppointmentEntity } from "@modules/appointments/infra/typeorm/entities/Appointment.model";
import { uuid } from 'uuidv4';
import { isEqual, getMonth, getYear, getDate } from "date-fns";
import IFindAllInMonthFromProviderDTO from "@modules/appointments/dtos/IFindAllInMonthFromProviderDTO";
import IFindAllInDayFromProviderDTO from "@modules/appointments/dtos/IFindAllInDayFromProviderDTO";
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