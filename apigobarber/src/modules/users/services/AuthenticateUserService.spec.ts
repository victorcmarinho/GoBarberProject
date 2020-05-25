import AppError from "@shared/errors/AppErros";
import FakeHashProvider from "../providers/HashProvider/fakes/FakeBCryptHashProvider";
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import AuthenticateUserService from "./AuthenticateUserService";
import CreateUserService from "./CreateUserService";

let fakeUsersRepository:FakeUsersRepository;
let fakeHashProvider:FakeHashProvider;
let createdUsersService:CreateUserService;
let authenticatedUsers: AuthenticateUserService;
describe('AuthenticateUser', () => {

    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        createdUsersService = new CreateUserService(fakeUsersRepository, fakeHashProvider);
        authenticatedUsers = new AuthenticateUserService(fakeUsersRepository, fakeHashProvider);

    });


    it('should be able to authenticate', async () => {

        const user = await createdUsersService.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        });


        const response = await authenticatedUsers.execute({
            email: 'johndoe@example.com',
            password: '123456'
        });

        expect(response).toHaveProperty('token');
        expect(response.user).toEqual(user);
        
    });

    it('should not be able to authenticate with non existing user', async () => {

        await expect(authenticatedUsers.execute({
            email: 'johndoe@example.com',
            password: '123456'
        })).rejects.toBeInstanceOf(AppError)
        
    });


    it('should not be able to authenticate with wrong password', async () => {

        
        const user = await createdUsersService.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        });

        await expect(authenticatedUsers.execute({
            email: 'johndoe@example.com',
            password: 'wrong-password'
        })).rejects.toBeInstanceOf(AppError);
        
    });


});