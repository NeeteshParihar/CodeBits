import Redis from "ioredis";
import dotenv from 'dotenv';

dotenv.config({path: './redis.env'});

const redisclient = new Redis({
    username: process.env['redis_username'],
    password: process.env['redis_password'],
    host: process.env['redis_host'],
    port: process.env['redis_port'],
    lazyConnect: true
})

export async function connectToRedis() {
  try {
    await redisclient.connect(); // Await the connection
    return true;
  } catch (err) {
    console.error("Error connecting to Redis:", err);
    return false;
  }
}

export default redisclient;