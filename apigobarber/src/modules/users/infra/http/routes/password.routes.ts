import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';
import { Router } from 'express';
import { container } from 'tsyringe';
import ForgotPasswordController from '../controllers/ForgotPasswordControler';
import ResetPasswordController from '../controllers/ResetPasswordController';
import { celebrate, Segments, Joi } from 'celebrate';

const passwordRouter = Router();

const forgotPasswordController =  new ForgotPasswordController();
const resetPasswordController = new ResetPasswordController()


passwordRouter.post('/forgot',celebrate({
    [Segments.BODY] : {
        email: Joi.string().email().required()
    },
}), forgotPasswordController.create);

passwordRouter.post('/reset', celebrate({
    [Segments.BODY] : {
        token: Joi.string().uuid().required(),
        password: Joi.string().required(),
        password_confirmation: Joi.string().required().valid(Joi.ref('password'))
    },
}) ,resetPasswordController.create);


export default passwordRouter;
