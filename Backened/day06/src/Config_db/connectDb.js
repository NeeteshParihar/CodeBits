import mongoose from 'mongoose';

async function connectToMongoDb(url, database){

    const dbUrl = `${url}${database}`;

    try{

        await mongoose.connect(dbUrl);        
        return true;
    }catch(err){

        // log the error
        console.error("error connecting to mongodb", err);
        return false;
    }
}

export default connectToMongoDb;