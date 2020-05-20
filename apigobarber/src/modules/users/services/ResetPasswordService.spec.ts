import FakeMailProvider from "@shared/container/providers/MailProvider/fakes/FakeMailProvider";
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import FakeUserTokensRepository from "../repositories/fakes/FakeUserTokensRepository";
import SendForgotPasswordEmailService from "./SendForgotPasswordEmailService";
import ResetPasswordService from "./ResetPasswordService";
import FakeHashProvider from "../providers/HashProvider/fakes/FakeBCryptHashProvider";
import AppError from "@shared/errors/AppErros";

let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeHashProvider: FakeHashProvider;

let sendForgotPasswordEmail: SendForgotPasswordEmailService;
let resetPassword: ResetPasswordService;

describe('ResetPasswordService', () => {

    beforeEach(() => {
        
        fakeUsersRepository = new FakeUsersRepository();
        fakeMailProvider = new FakeMailProvider();
        fakeUserTokensRepository = new FakeUserTokensRepository();
        fakeHashProvider = new FakeHashProvider();

        sendForgotPasswordEmail = new SendForgotPasswordEmailService(
            fakeUsersRepository,
            fakeMailProvider, 
            fakeUserTokensRepository
        );

        resetPassword = new ResetPasswordService(
            fakeUsersRepository,
            fakeUserTokensRepository,
            fakeHashProvider
        );

    })

    it('should be able to reset the password', async () => {

        const user = await fakeUsersRepository.create({
            name: 'johndoe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        const { token } = await fakeUserTokensRepository.generate(user.id);

        const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');
        
        await resetPassword.execute({
            token,
            password: '123123',
        });

        const updatedUser = await fakeUsersRepository.findById(user.id);


        expect(generateHash).toBeCalledWith('123123');

        expect(updatedUser?.password).toBe('123123');

    });


    it('should not be able to reset password with non-existing token', async () => {
        await expect(
            resetPassword.execute({
                token: 'non-existing-token',
                password: '123123'
            })
        ).rejects.toBeInstanceOf(AppError)
    });


    it('should not be able to reset password with non-existing user', async () => {

        const {token} = await fakeUserTokensRepository.generate('non-existing-user');

        await expect(
            resetPassword.execute({
                token: token,
                password: '123123'
            })
        ).rejects.toBeInstanceOf(AppError)
    });


    it('should not be able to reset password if passed more than 2 hours', async () => {

        const user = await fakeUsersRepository.create({
            name: 'johndoe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        const { token } = await fakeUserTokensRepository.generate(user.id);

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            const customDate = new Date();

            return customDate.setHours(customDate.getHours() + 3);
        })

        await expect(resetPassword.execute({
            token,
            password: '123123',
        })).rejects.toBeInstanceOf(AppError);

    });

})