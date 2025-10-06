import express from 'express';
import dotenv from 'dotenv';
import connectToMongoDb from './Config_db/connectDb.js';
import cookieParser from 'cookie-parser';
import authRouter from './Routes/userAuth.js';
import redisclient, {connectToRedis} from './Config_db/redis.js';

dotenv.config({ path: './.env' });

const PORT = process.env['PORT'] || 5008;
const database = process.env['database'] || 'Leetcode';
const mongodb_connection_url = process.env['mongodb_connection_url'];

const app = express();

app.use(express.json()); // middleware which converts json format to js object 
app.use(cookieParser()); // middleware which using a handler which parser cookie header and into object and assigns it to req.cookies


// rate limiter comes here



app.use('/auth', authRouter);

app.use('/', (req, res)=>{
    res.status(404).json({
        success: true,
        message: "hello bro"
    })
})



const initializeConnection = async () => {
  try {
    const [isConnectedToMongo, isConnectedToRedis] = await Promise.all([
      connectToMongoDb(mongodb_connection_url, database),
      connectToRedis()
    ]);

    console.log("MongoDB connected:", isConnectedToMongo);
    console.log("Redis connected:", isConnectedToRedis);

    if (!isConnectedToMongo || !isConnectedToRedis) {
      throw new Error(`Connection to databases failed; MongoDb: ${isConnectedToMongo}; Redis: ${isConnectedToRedis}`);
    }

    console.log("Connected to MongoDB and Redis successfully");

    app.listen(PORT, () => {
      console.log(`Server is running at PORT: ${PORT}`);
    });
  } catch (err) {
    console.error("Error during initialization:", err);
    process.exit(1); // Optional: exit if either connection fails
  }
};

initializeConnection();