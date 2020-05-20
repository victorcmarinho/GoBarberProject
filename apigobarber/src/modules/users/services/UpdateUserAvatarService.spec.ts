import FakeStorageProvider from "@shared/container/providers/StorageProvider/fakes/FakeStorageProvider";
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import UpdateUserAvatarService from "./UpdateUserAvatarService";
import AppError from "@shared/errors/AppErros";

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatarService: UpdateUserAvatarService;
describe('UpdateUserAvatar', () => {

    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeStorageProvider = new FakeStorageProvider();
        updateUserAvatarService = new UpdateUserAvatarService(fakeUsersRepository,fakeStorageProvider);
    })

    it('should be able to update avatar from existing user', async () => {
        
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        })

        const updateUserAvatar = await updateUserAvatarService.execute({
            user_id: user.id,
            avatarFileName: 'avatar.jpg',
        });

        expect(updateUserAvatar.avatar).toBe('avatar.jpg');
    });

    it('should not be able to update avatar from non existing user', async () => {

        expect(updateUserAvatarService.execute({
            user_id: 'non-existing-user-id',
            avatarFileName: 'avatar.jpg',
        })).rejects.toBeInstanceOf(AppError)
    });

    it('should delete old avatar when updating new one', async () => {
       
        const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        })

        await updateUserAvatarService.execute({
            user_id: user.id,
            avatarFileName: 'avatar.jpg',
        });

        const updateUserAvatar = await updateUserAvatarService.execute({
            user_id: user.id,
            avatarFileName: 'avatar2.jpg',
        });

        expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');

        expect(updateUserAvatar.avatar).toBe('avatar2.jpg');
    });

});