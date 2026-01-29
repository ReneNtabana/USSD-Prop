import redis from 'redis';

const connection = redis.createClient({
    host: 'localhost',
    port: 6379,
});

connection.on('connect', () => {
    console.log('Connected to Redis');
});

export default connection;