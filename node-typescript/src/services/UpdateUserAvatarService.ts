import fs from 'fs';
import path from 'path';
import { getRepository } from "typeorm";
import uploadConfig from '../config/upload';
import AppError from '../errors/AppErros';
import { UserModel } from "../models/User.model";

interface RequestDTO {
    user_id: string,
    avatarFileName: string
}

export default class UpdateUserAvatarService {
    public async execute({user_id, avatarFileName}: RequestDTO): Promise<UserModel> {
        const usersRepository = getRepository(UserModel);

        const user = await usersRepository.findOne(user_id);

        if(!user) 
            throw new AppError('Only authenticated useres can change avatar.', 401);
        
        if(user.avatar) {
            const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
            const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

            if(userAvatarFileExists) {
                await fs.promises.unlink(userAvatarFilePath);
            }
        }

        user.avatar = avatarFileName;

        await usersRepository.save(user);

        return user;

    }
}