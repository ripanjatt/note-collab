import { RedisClientType, createClient } from 'redis';
import { LogUtil } from 'src/utils/customLogger';

let redis: RedisClientType;

/**
 *
 * Connects to redis server
 *
 */
export const connectToRedis = async () => {
  redis = createClient({
    socket: {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
    },
    password: process.env.REDIS_PASSWORD,
  });
  redis.on('error', (err) => {
    LogUtil.error(`Failed to connect to Redis: ${err}`);
  });
  await redis.connect().then(() => {
    LogUtil.log('Application connected to redis server successfully');
  });
};

/**
 *
 * Saves key value pair in redis store.
 *
 * @remarks
 * Saves the object after stringifying as redis package doesn't allow objects as values
 *
 * @param key - type: string
 * @param value - type: any
 */
export const setCache = async (key: string, value: any) => {
  await redis.set(key, JSON.stringify(value));
  redis.expire(key, 3600);
};

/**
 *
 * Gets the value of from redis store mapped on the provided key.
 *
 * @param key - type: string
 * @returns Promise\<any\>
 */
export const getCache = async (key: string) => {
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
};
