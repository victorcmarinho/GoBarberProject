import ICreateUserDTO from "@modules/users/dtos/ICreateUserDTO";
import IUsersRepository from "@modules/users/repositories/IUsersRepository";
import { getRepository, Repository, Not } from "typeorm";
import { UserEntity } from "../entities/UserEntity";
import IFindAllProvidersDTO from "@modules/users/dtos/IFindAllProvidersDTO";

export default class UsersRepository implements IUsersRepository{

    private ormRepository: Repository<UserEntity>;

    constructor() {
        this.ormRepository = getRepository(UserEntity);
    }

    async findAllProviders({except_user_id}: IFindAllProvidersDTO): Promise<UserEntity[]> {
        if(except_user_id)
            return this.ormRepository.find({ where: {id: Not(except_user_id)}}) ?? [];
        return this.ormRepository.find() ?? [];
    }

    async findById(id: string): Promise<UserEntity | undefined> {
        return await this.ormRepository.findOne(id);
    }
    async findByEmail(email: string): Promise<UserEntity | undefined> {
        return await this.ormRepository.findOne({where: {email}});
    }
    async create(userData: ICreateUserDTO): Promise<UserEntity> {
        const user = this.ormRepository.create(userData);
        return await this.ormRepository.save(user);

    }
    async save(user: UserEntity): Promise<UserEntity> {
        return await this.ormRepository.save(user);
    }


}