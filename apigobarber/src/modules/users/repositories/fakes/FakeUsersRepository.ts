import ICreateUserDTO from "@modules/users/dtos/ICreateUserDTO";
import IFindAllProvidersDTO from "@modules/users/dtos/IFindAllProvidersDTO";
import { UserEntity } from "@modules/users/infra/typeorm/entities/UserEntity";
import IUsersRepository from "@modules/users/repositories/IUsersRepository";
import { uuid } from "uuidv4";

export default class FakeUsersRepository implements IUsersRepository{


    private users: UserEntity[] = [];

    async findById(id: string): Promise<UserEntity | undefined> {
        return this.users.find(user => user.id === id);
    }
    
    async findByEmail(email: string): Promise<UserEntity | undefined> {
        return this.users.find(user => user.email === email);
    }
    
    async create(userData: ICreateUserDTO): Promise<UserEntity> {
        const user = new UserEntity();
        Object.assign(user,  {id: uuid()}, userData);
        this.users.push(user);
        return user;

    }
    
    async save(user: UserEntity): Promise<UserEntity> {
        const index = this.users.findIndex(u => u.id === user.id);

        this.users[index] = user;

        return user;

    }

    async findAllProviders({except_user_id}: IFindAllProvidersDTO): Promise<UserEntity[]> {
        if(except_user_id)
            return this.users.filter(user => user.id !== except_user_id);
        return this.users;
    }


}