import { createClient } from 'redis';


// Create and configure Redis client
const redisClient = createClient({
    socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: 6379,
    },
});

redisClient.on('error', (err) => {
    console.error('Redis connection error:', err);
});

redisClient.connect();

export default redisClient;
