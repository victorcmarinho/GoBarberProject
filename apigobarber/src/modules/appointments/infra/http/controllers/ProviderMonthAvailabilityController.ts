import ListProviderMonthAvailabilityService from '@modules/appointments/services/ListProviderMonthAvailabilityService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class ProviderMonthAvailabilityController {

    public async index(request: Request, response: Response): Promise<Response> {
        
        const user_id = request.user.id;
        
        const { provider_id } = request.params;
        
        const { year, month } = request.query;
        
        const listProviderMonthAvailabilityService = container.resolve(ListProviderMonthAvailabilityService);
        
        const availability = await listProviderMonthAvailabilityService.execute({ 
            month: Number(month), 
            year: Number(year), 
            provider_id
        });

        return response.json(availability);

    }
}