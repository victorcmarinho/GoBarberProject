import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import SendForgotPasswordEmailService from "./SendForgotPasswordEmailService";
import FakeMailProvider from "@shared/container/providers/MailProvider/fakes/FakeMailProvider";
import AppError from "@shared/errors/AppErros";
import FakeUserTokensRepository from "../repositories/fakes/FakeUserTokensRepository";

let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {

    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeMailProvider = new FakeMailProvider();
        fakeUserTokensRepository = new FakeUserTokensRepository();
        sendForgotPasswordEmail = new SendForgotPasswordEmailService(
            fakeUsersRepository,
            fakeMailProvider, 
            fakeUserTokensRepository
        );
    })

    it('should be able to recover the password using the email', async () => {


        const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');


        
        await fakeUsersRepository.create({
            name: 'johndoe',
            email: 'johndoe@example.com',
            password: '123456',
        })
        
        await sendForgotPasswordEmail.execute({ email: 'johndoe@example.com'});


        expect(sendMail).toHaveBeenCalled();

    });

    it('should not be able to recover a non-existent email', async () => {
        
        expect(sendForgotPasswordEmail.execute({
            email: 'johndoe@example.com'
        })).rejects.toBeInstanceOf(AppError);

    });

    it('should generate a forgot password token', async () => {
        
        const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

        const user = await fakeUsersRepository.create({
            name: 'johndoe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        await sendForgotPasswordEmail.execute({
            email: 'johndoe@example.com',
        });

        expect(generateToken).toHaveBeenCalledWith(user.id);

    });

})