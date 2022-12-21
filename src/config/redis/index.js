export const redisConfig = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSW
};
