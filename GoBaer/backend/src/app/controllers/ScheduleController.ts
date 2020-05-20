import Appointment from '../models/Appointment';
import User from '../models/User';
import { Response, Request } from 'express';
import { startOfDay, endOfDay, parseISO} from 'date-fns';
import { Op } from 'sequelize';

class ScheduleController {

    async index(req: Request, res: Response) {
        const checkUserProvider = await User.findOne({
            where: {id: req.userId, provider: true}
        })
        if(!checkUserProvider)
            return res.status(401).json({ error: 'User is not a provider'});

        const parsedDate = parseISO(req.query['date']);
        const appointments = await Appointment.findAll({
            where: {
                provider_id: req.userId,
                canceled_at: null,
                date: {
                    [Op.between]: [
                        startOfDay(parsedDate), endOfDay(parsedDate)
                    ]
                },
            },
            order: ['date']
        });

        return res.json(appointments);
    }
}

export default new ScheduleController();