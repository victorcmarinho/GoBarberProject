import { UserEntity } from "@modules/users/infra/typeorm/entities/UserEntity";
import IUsersRepository from "@modules/users/repositories/IUsersRepository";
import { inject, injectable } from "tsyringe";

interface IRequest {
    user_id: string;
}

@injectable()
export default class ListProvidersService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository
    ) {}

    public async execute({user_id}: IRequest): Promise<UserEntity[]> {

        const users = await this.usersRepository.findAllProviders({except_user_id: user_id});

        return users;
    }
}