import { UserEntity } from "@modules/users/infra/typeorm/entities/UserEntity";
import IUsersRepository from "@modules/users/repositories/IUsersRepository";
import { inject, injectable } from "tsyringe";
import ICacheProvider from "@shared/container/providers/CacheProvider/models/ICacheProvider";
import { classToClass } from "class-transformer";

interface IRequest {
    user_id: string;
}

@injectable()
export default class ListProvidersService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('CacheProvider')
        private cacheProvider: ICacheProvider
    ) {}

    public async execute({user_id}: IRequest): Promise<UserEntity[]> {

        let users = await this.cacheProvider.recover<UserEntity[]>(`providers-list:${user_id}`);

        if(!users){
            users = await this.usersRepository.findAllProviders({except_user_id: user_id});
            await this.cacheProvider.save(`providers-list:${user_id}`, classToClass(users))
        }

        return users;
    }
}