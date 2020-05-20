import { EntityRepository, Repository } from "typeorm";
import { AppointmentModel } from "../models/Appointment.model";

@EntityRepository(AppointmentModel)
export default class AppointmentsRepository  extends Repository<AppointmentModel>{

    public async findByDate(date: Date): Promise<AppointmentModel | null> {
        const findAppointment = await this.findOne({
            where: { date },
        });
        return findAppointment || null;
        
    }


}