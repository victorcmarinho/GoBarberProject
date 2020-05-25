import ICreateAppointmentDTO from "../dtos/ICreateAppointmentDTO";
import IFindAllInDayFromProviderDTO from "../dtos/IFindAllInDayFromProviderDTO";
import IFindAllInMonthFromProviderDTO from "../dtos/IFindAllInMonthFromProviderDTO";
import { AppointmentEntity } from "../infra/typeorm/entities/Appointment.model";

export default interface IAppointmentsRepository {
    create(data: ICreateAppointmentDTO): Promise<AppointmentEntity>;
    findByDate(date: Date): Promise<AppointmentEntity | undefined>;
    findAllInMonthFromProvider(data: IFindAllInMonthFromProviderDTO): Promise<AppointmentEntity[]>
    findAllInDayFromProvider(date: IFindAllInDayFromProviderDTO): Promise<AppointmentEntity[]>;
}