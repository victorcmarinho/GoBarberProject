import AppError from "@shared/errors/AppErros";
import FakeHashProvider from "../providers/HashProvider/fakes/FakeBCryptHashProvider";
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import CreateUserService from "./CreateUserService";
import FakeCacheProvider from "@shared/container/providers/CacheProvider/fakes/FakeCacheProvider";

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;
let createdUsers: CreateUserService;

describe('CreateUser', () => {

    beforeEach(() => {
        
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        fakeCacheProvider = new FakeCacheProvider();
        createdUsers = new CreateUserService(fakeUsersRepository,fakeHashProvider,fakeCacheProvider);

    });

    it('should be able to create a new user', async () => {
        
        const response = await createdUsers.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        });

        expect(response).toHaveProperty('id');
    });

    it('should not be able to create a new user with same email from another', async () => {
        
        await createdUsers.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        });

        await expect(createdUsers.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        })).rejects.toBeInstanceOf(AppError);
    });
});