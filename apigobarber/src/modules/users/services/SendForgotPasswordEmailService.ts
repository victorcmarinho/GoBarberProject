import IMailProvider from "@shared/container/providers/MailProvider/model/IMailProvider";
import { inject, injectable } from "tsyringe";
import path from "path";
import { UserEntity } from "../infra/typeorm/entities/UserEntity";
import IUsersRepository from "../repositories/IUsersRepository";
import AppError from "@shared/errors/AppErros";
import IUserTokensRepository from "../repositories/IUserTokensRepository";

interface IRequestDTO {
    email: string,
}

interface IResponseDTO {
    user: UserEntity,
    token: string
}
@injectable()
export default class SendForgotPasswordEmailService {

    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('MailProvider')
        private mailProvider: IMailProvider,

        @inject('UserTokensRepository')
        private userTokensRepository: IUserTokensRepository
    ) { }
    public async execute({email}: IRequestDTO): Promise<void> {

        const user = await this.usersRepository.findByEmail(email);

        if(!user)
            throw new AppError('User email not found');

        const {token} = await this.userTokensRepository.generate(user.id);            
        const forgotPasswordTemplate = path.resolve(__dirname, '..', 'views', 'forgot_password.hbs');
        await this.mailProvider.sendMail({
            to: {
                name: user.name,
                email: user.email
            },
            subject: '[GoBarber] Recuperação de senha',
            templateData: {
                file: forgotPasswordTemplate,
                variables: {
                    name: user.name,
                    link: `${process.env.APP_WEB_URL}/reset_password?token=${token}`
                }
            }
        });

    }
}