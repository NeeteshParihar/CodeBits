
import { createClient } from "redis";

const client = createClient({
    username: 'default',
    password: 'k0ZI8YBgfVC93X1VhSj4bvZjPdotj37y',
    socket: {
        host: 'redis-17916.crce217.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: 17916
    }
});


client.on('error', err => console.log('Redis Client Error', err));

export async function connectRedis(){
    try{
        await client.connect();
        console.log("connected to redis");
    }catch(err){
        console.error('Error connecting to redis', err );
    }
}


export default client;