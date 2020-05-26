import ICacheProvider from "../models/ICacheProvider";
import cacheConfig from '@config/cache';
import Redis, {Redis as RedisClient} from 'ioredis';

interface ICacheData {
    [key: string]: string;
}
export default class FakeCacheProvider implements ICacheProvider {

    private cache: ICacheData = {}

    async save(key: string, value: any): Promise<void> {
        this.cache[key] = JSON.stringify(value)
    }

    async recover<T>(key: string): Promise<T | null> {
        const data = this.cache[key]

        if(!data)
            return null;
        
        const parsedData = JSON.parse(data) as T;
        
        return parsedData;
    }

    async invalidate(key: string): Promise<void> {
        delete this.cache[key];
    }

    async invalidadePrefix(prefix: string): Promise<void> {
        
        const keys = Object.keys(this.cache).filter(key => key.startsWith(`${prefix}:`));

        keys.forEach( key => {
            delete this.cache[key]
        });

    }

}