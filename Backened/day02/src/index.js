import express from 'express';
import dotenv from 'dotenv';
import connectDatabase from './Config_db/connectDb.js';
import cookieParser from 'cookie-parser';

dotenv.config({ path: './.env' });

const PORT = process.env['PORT'] || 5008;
const database = process.env['database'] || 'Leetcode';
const mongodb_connection_url = process.env['mongodb_connection_url'];

const app = express();

app.use(express.json()); // middleware which converts json format to js object 
app.use(cookieParser()); // middleware which using a handler which parser cookie header and into object and assigns it to req.cookies


const {success, message, err} =  await connectDatabase(mongodb_connection_url, database);

if(success){

    console.log(message);
    app.listen(PORT, ()=>{
        console.log('server is running at port ', PORT);
    })
}else{
    console.log(message);
    console.log(err);
}
