import RedisCacheProvider from "./implementations/RedisCacheProvider";
import { container } from "tsyringe";
import ICacheProvider from "./models/ICacheProvider";


const providers = {
    redis: RedisCacheProvider
}

container.registerSingleton<ICacheProvider>(
    'CacheProvider',
    providers.redis
)