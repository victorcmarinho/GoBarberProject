import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import fs from 'fs';
import path from 'path';
import { inject, injectable } from 'tsyringe';
import uploadConfig from '../../../config/upload';
import AppError from '../../../shared/errors/AppErros';
import { UserEntity } from '../infra/typeorm/entities/UserEntity';
import IUsersRepository from '../repositories/IUsersRepository';

interface RequestDTO {
    user_id: string,
    avatarFileName: string
}

@injectable()
export default class UpdateUserAvatarService {

    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('StorageProvider')
        private storageProvider: IStorageProvider
    ) { }
    
    public async execute({user_id, avatarFileName}: RequestDTO): Promise<UserEntity> {

        const user = await this.usersRepository.findById(user_id);

        if(!user) 
            throw new AppError('Only authenticated useres can change avatar.', 401);
        
        if(user.avatar) {
            await this.storageProvider.deleteFile(user.avatar);
        }

        const fileName = await this.storageProvider.saveFile(avatarFileName);

        user.avatar = fileName;

        await this.usersRepository.save(user);

        return user;

    }
}