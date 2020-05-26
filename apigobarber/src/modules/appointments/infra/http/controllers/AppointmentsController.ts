import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import { parseISO } from 'date-fns';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class AppointmentsController {
    public async create(request: Request, response: Response): Promise<Response> {

        const user_id = request.user.id;
        let { provider_id, date } = request.body;
        
        const createAppointment = container.resolve(CreateAppointmentService);
        const appointment = await createAppointment.execute({ date, provider_id, user_id });
        return response.json(appointment);

    }
}