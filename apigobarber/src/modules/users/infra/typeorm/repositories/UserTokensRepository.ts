import IUserTokensRepository from "@modules/users/repositories/IUserTokensRepository";
import { getRepository, Repository } from "typeorm";
import { UserTokenEntity } from "../entities/UserTokenEntity";

export default class UserTokensRepository implements IUserTokensRepository{
    
    private ormRepository: Repository<UserTokenEntity>;

    constructor() {
        this.ormRepository = getRepository(UserTokenEntity);
    }
    
    async generate(user_id: string): Promise<UserTokenEntity> {
        const userToken =  this.ormRepository.create({
            user_id
        });

        await this.ormRepository.save(userToken);

        return userToken;
    }

    async findByTokenId(token: string): Promise<UserTokenEntity | undefined> {
        return await this.ormRepository.findOne({
            where: {token}
        });
    }

}