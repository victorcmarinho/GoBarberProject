import { Router } from 'express';

import multer from 'multer';
import multerConfig from './config/multer';

import UserControler from './app/controllers/UserControler';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth.middleware';
import fileController from './app/controllers/fileController';
import ProviderController from './app/controllers/ProviderController';
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleController from './app/controllers/ScheduleController';
import NotificationController from './app/controllers/NotificationController';
import AvailableController from './app/controllers/AvailableController';

declare global {
    namespace Express {
        interface Request {
            userId: string
        }
    }
}
const routes = Router();
const upload = multer(multerConfig);

routes.post('/users', UserControler.store);

routes.put('/users', authMiddleware, UserControler.update);

routes.post('/sessions', SessionController.store);

routes.post('/files', authMiddleware, upload.single('file'), fileController.store);

routes.get('/providers',authMiddleware, ProviderController.index);

routes.get('/providers/:providerId/available',authMiddleware, AvailableController.index);


routes.post('/appointments', authMiddleware, AppointmentController.store);

routes.get('/appointments', authMiddleware, AppointmentController.index);

routes.delete('/appointments/:id', authMiddleware, AppointmentController.delete);

routes.get('/schedule', authMiddleware, ScheduleController.index);

routes.get('/notifications',authMiddleware, NotificationController.index);

routes.put('/notifications/:id',authMiddleware, NotificationController.update);

export default routes;
