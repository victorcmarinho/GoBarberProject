import FakeStorageProvider from "@shared/container/providers/StorageProvider/fakes/FakeStorageProvider";
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import UpdateUserAvatarService from "./UpdateUserAvatarService";
import AppError from "@shared/errors/AppErros";
import FakeHashProvider from "../providers/HashProvider/fakes/FakeBCryptHashProvider";
import UpdateProfileService from "./UpdateProfileService";

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let fakeHashProvider: FakeHashProvider;
let updateProfileService: UpdateProfileService;

describe('UpdateUserAvatar', () => {

    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeStorageProvider = new FakeStorageProvider();
        fakeHashProvider = new FakeHashProvider();

        updateProfileService = new UpdateProfileService(fakeUsersRepository, fakeHashProvider);
    })

    it('should be able to update the profile', async () => {
        
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        })

        const updateUser = await updateProfileService.execute({
            user_id: user.id,
            name: 'John Tre',
            email: 'johntre@example.com'
        });

        expect(updateUser.name).toBe('John Tre');
        expect(updateUser.email).toBe('johntre@example.com');
        
    });
    
    it('should be able to update the profile not found', async () => {
        
        await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        });

        await expect(updateProfileService.execute({
            user_id: 'user.id',
            name: 'John Tre',
            email: 'johntre@example.com'
        })).rejects.toBeInstanceOf(AppError)
        
    });


    it('should be able to change to another user email', async () => {
        
        await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        });

        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe2@example.com',
            password: '123456'
        })

        await expect(updateProfileService.execute({
            user_id: user.id,
            name: 'John Doe',
            email: 'johndoe@example.com'
        })).rejects.toBeInstanceOf(AppError);
        
    });


    it('should be able to update the password', async () => {
        
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        })

        const updateUser = await updateProfileService.execute({
            user_id: user.id,
            name: 'John Tre',
            email: 'johntre@example.com',
            old_password: '123456',
            password: '123123'
        });

        expect(updateUser.name).toBe('John Tre');
        expect(updateUser.email).toBe('johntre@example.com');
        expect(updateUser.password).toBe('123123');
        
        
    });

    it('should be able to update the password wihout old password', async () => {
        
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        })

        await expect(updateProfileService.execute({
            user_id: user.id,
            name: 'John Tre',
            email: 'johntre@example.com',
            password: '123123'
        })).rejects.toBeInstanceOf(AppError)        
        
    });


    
    it('should be able to update the password with wrong old password', async () => {
        
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        })

        await expect(updateProfileService.execute({
            user_id: user.id,
            name: 'John Tre',
            email: 'johntre@example.com',
            old_password: '654321',
            password: '123123'
        })).rejects.toBeInstanceOf(AppError)        
        
    });



});