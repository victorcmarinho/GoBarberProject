import { AppointmentEntity } from "../infra/typeorm/entities/Appointment.model";
import ICreateAppointmentDTO from "../dtos/ICreateAppointmentDTO";
import IFindAllInMonthFromProviderDTO from "../dtos/IFindAllInMonthFromProviderDTO";
import IFindAllInDayFromProviderDTO from "../dtos/IFindAllInDayFromProviderDTO";

export default interface IAppointmentsRepository {
    create(data: ICreateAppointmentDTO): Promise<AppointmentEntity>;
    findByDate(date: Date): Promise<AppointmentEntity | undefined>;
    findAllInMonthFromProvider(data: IFindAllInMonthFromProviderDTO): Promise<AppointmentEntity[]>
    findAllInDayFromProvider(date: IFindAllInDayFromProviderDTO): Promise<AppointmentEntity[]>;
}