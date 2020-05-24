import { inject, injectable } from "tsyringe";
import IUsersRepository from "../repositories/IUsersRepository";
import IUserTokensRepository from "../repositories/IUserTokensRepository";
import AppError from "@shared/errors/AppErros";
import IHashProvider from "../providers/HashProvider/models/IHashProvider";
import { differenceInHours } from 'date-fns'

interface IRequest {
    token: string;
    password: string;
}

@injectable()
export default class ResetPasswordService {

    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('UserTokensRepository')
        private userTokensRepository: IUserTokensRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider
    ){ }

    public async execute({token, password}: IRequest): Promise<void> {
        
        const userToken = await this.userTokensRepository.findByTokenId(token);
        console.log('teste aaa', userToken)
        if(!userToken)
            throw new AppError('User token does not exist');
        
        const user = await this.usersRepository.findById(userToken.user_id);

        if(!user)
            throw new AppError('User does not exist');

        const tokenCreatedAt = userToken.created_at;

        if(differenceInHours(Date.now(), tokenCreatedAt) > 2)
            throw new AppError('Token expired');
        

        user.password = await this.hashProvider.generateHash(password);

        await this.usersRepository.save(user);

    }


}