import Redis from "ioredis";
import dotenv from 'dotenv';

dotenv.config({path: './redis.env'});

const redisclient = new Redis({
    username: process.env['redis_username'],
    password: process.env['redis_password'],
    host: process.env['redis_host'],
    port: process.env['redis_port']
})

redisclient.on('error', (err) => {
    console.log('error connecting to redis', err);
})

redisclient.on('connect', () => {
    console.log("connected successfull to redis");
})

export default redisclient;