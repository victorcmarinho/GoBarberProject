import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class ProviderDayAvailabilityController {

    public async index(request: Request, response: Response): Promise<Response> {

        const user_id = request.user.id;

        const { provider_id } = request.params;

        const { year, month, day } = request.query

        
        const listProviderDayAvailabilityService = container.resolve(ListProviderDayAvailabilityService);
        
        const availability = await listProviderDayAvailabilityService.execute({ 
            day: Number(day), 
            month: Number(month), 
            year: Number(year), 
            provider_id,
        });

        return response.json(availability);

    }
}