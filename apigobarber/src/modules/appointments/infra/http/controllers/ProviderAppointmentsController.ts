import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class ProviderAppointmentsController {
    public async index(request: Request, response: Response): Promise<Response> {
        
        const provider_id = request.user.id;
        let { day, month, year } = request.body;

        const listProviderAppointmentsService = container.resolve(ListProviderAppointmentsService);
        const appointments = await listProviderAppointmentsService.execute({ day, month, year, provider_id});

        return response.json(appointments);

    }
}