import IUserTokensRepository from "@modules/users/repositories/IUserTokensRepository";
import { UserTokenEntity } from "../entities/UserTokenEntity";
import { Repository, getRepository } from "typeorm";

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

    async findByTokenId(tokenId: string): Promise<UserTokenEntity | undefined> {
        return await this.ormRepository.findOne({
            where: {tokenId}
        });
    }

}