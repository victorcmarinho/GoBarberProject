import { UserEntity } from "../infra/typeorm/entities/UserEntity";
import ICreateUserDTO from "../dtos/ICreateUserDTO";
import IFindAllProvidersDTO from "../dtos/IFindAllProvidersDTO";

export default interface IUsersRepository {
    findAllProviders(data: IFindAllProvidersDTO): Promise<UserEntity[]>;
    findById(id: string): Promise<UserEntity | undefined>;
    findByEmail(email: string): Promise<UserEntity | undefined>;
    create(data: ICreateUserDTO): Promise<UserEntity>;
    save(user: UserEntity): Promise<UserEntity>;
    
}