import { UserTokenEntity } from "../infra/typeorm/entities/UserTokenEntity";

export default interface IUserTokensRepository {
    generate(user_id: string): Promise<UserTokenEntity>;
    findByTokenId(tokenId: string): Promise<UserTokenEntity|undefined>;
}