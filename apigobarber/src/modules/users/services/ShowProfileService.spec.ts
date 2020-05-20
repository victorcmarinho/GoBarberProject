import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import ShowProfileService from "./ShowProfileService";
import UpdateProfileService from "./UpdateProfileService";
import AppError from "@shared/errors/AppErros";

let fakeUsersRepository: FakeUsersRepository;

let showProfileService: ShowProfileService;

describe('UpdateUserAvatar', () => {

    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        
        showProfileService = new ShowProfileService(fakeUsersRepository);
    })

    it('should be able to show the profile', async () => {
        
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        })

        const profile = await showProfileService.execute({
            user_id: user.id,
        });

        expect(profile.name).toBe('John Doe');
        expect(profile.email).toBe('johndoe@example.com');
        
    });

    it('should not be able to show the profile from non-existing user', async () => {
        
        await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        })

        await expect(showProfileService.execute({
            user_id: 'user.id',
        })).rejects.toBeInstanceOf(AppError)
  
        
    });

});