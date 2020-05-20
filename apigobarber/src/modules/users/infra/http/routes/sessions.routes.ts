import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';
import { Router } from 'express';
import { container } from 'tsyringe';
import SessionsController from '../controllers/SessionsController';

const sessionsRouter = Router();
const sessionsController =  new SessionsController()

sessionsRouter.post('/', sessionsController.create);

export default sessionsRouter;
