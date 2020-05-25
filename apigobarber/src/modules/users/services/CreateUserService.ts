import { inject, injectable } from "tsyringe";
import AppError from "../../../shared/errors/AppErros";
import { UserEntity } from "../infra/typeorm/entities/UserEntity";
import IHashProvider from "../providers/HashProvider/models/IHashProvider";
import IUsersRepository from "../repositories/IUsersRepository";

interface RequestDTO {
    name: string,
    email: string,
    password: string
}

@injectable()
export default class CreateUserService {

    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('HashProvider')
        private hashProvider: IHashProvider
    ) { }
    public async execute({name, email, password}: RequestDTO): Promise<UserEntity> {
        
        const checkUserExists = await this.usersRepository.findByEmail(email);

        if(checkUserExists) {
            throw new AppError('Email address already used.');
        }
        const hashedPassword = await this.hashProvider.generateHash(password);

        const user = await this.usersRepository.create(
            {
                name,
                email,
                password: hashedPassword
            }
        );


        return user;
    }
}