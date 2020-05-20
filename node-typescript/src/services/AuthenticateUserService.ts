import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { getRepository } from "typeorm";
import auth from "../config/auth";
import AppError from "../errors/AppErros";
import { UserModel } from "../models/User.model";

interface RequestDTO {
    email: string,
    password: string
}

interface ResponseDTO {
    user: UserModel,
    token: string
}

export default class AuthenticateUserService {
    public async execute({email, password}: RequestDTO): Promise<ResponseDTO> {

        const usersRepository = getRepository(UserModel);
        const user = await usersRepository.findOne({
            where: {email}
        });
        
        const passwordMatched = await compare(password, user?.password ?? '');
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