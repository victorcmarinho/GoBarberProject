import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { getRepository } from "typeorm";
import auth from "../../../config/auth";
import AppError from "../../../shared/errors/AppErros";
import { UserEntity } from "../infra/typeorm/entities/UserEntity";
import IUsersRepository from "../repositories/IUsersRepository";
import { injectable, inject } from "tsyringe";
import IHashProvider from "../providers/HashProvider/models/IHashProvider";

interface IRequestDTO {
    email: string,
    password: string
}

interface IResponseDTO {
    user: UserEntity,
    token: string
}
@injectable()
export default class AuthenticateUserService {

    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('HashProvider')
        private hashProvider: IHashProvider
    ) { }
    public async execute({email, password}: IRequestDTO): Promise<IResponseDTO> {

        const user = await this.usersRepository.findByEmail(email);
        
        const passwordMatched = await this.hashProvider.compareHash(password, user?.password ?? '');
        if(!user || !passwordMatched) {
            throw new AppError('Incorrect email/password combination.', 401);
        }
        
        const token = sign({}, auth.jwt.secret, {
            subject: user.id,
            expiresIn: auth.jwt.expiresIn,
            
        });
        
        return {
            user,
            token
        }
        
    }
}