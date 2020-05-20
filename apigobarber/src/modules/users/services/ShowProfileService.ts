import { inject, injectable } from 'tsyringe';
import AppError from '../../../shared/errors/AppErros';
import { UserEntity } from '../infra/typeorm/entities/UserEntity';
import IUsersRepository from '../repositories/IUsersRepository';

interface RequestDTO {
    user_id: string;
}

@injectable()
export default class ShowProfileService {

    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository
    ) { }
    
    public async execute({user_id}: RequestDTO): Promise<UserEntity> {
        const user = await this.usersRepository.findById(user_id);

        if(!user) 
            throw new AppError('User not found.');

        delete user.password;
        return user;

    }
}