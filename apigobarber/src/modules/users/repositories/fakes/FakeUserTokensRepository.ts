import { UserTokenEntity } from "@modules/users/infra/typeorm/entities/UserTokenEntity";
import { uuid } from "uuidv4";
import IUserTokensRepository from "../IUserTokensRepository";

export default class FakeUserTokensRepository implements IUserTokensRepository {


    private usersTokens: UserTokenEntity[] = []


    async generate(user_id: string): Promise<UserTokenEntity> {
        const userToken = new UserTokenEntity();

        Object.assign(userToken,{
            id: uuid(),
            token: uuid(),
            user_id,
            created_at: new Date(),
            updated_at: new Date()
        });

        this.usersTokens.push(userToken);

        return userToken;
    }

    async findByTokenId(tokenId: string): Promise<UserTokenEntity|undefined> {
        const userToken = this.usersTokens.find(fToken => fToken.token === tokenId);
        return userToken;
    }

}