import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';
import { Router } from 'express';
import { container } from 'tsyringe';
import ForgotPasswordController from '../controllers/ForgotPasswordControler';
import ResetPasswordController from '../controllers/ResetPasswordController';

const passwordRouter = Router();

const forgotPasswordController =  new ForgotPasswordController();
const resetPasswordController = new ResetPasswordController()


passwordRouter.post('/forgot', forgotPasswordController.create);
passwordRouter.post('/reset', resetPasswordController.create);


export default passwordRouter;
