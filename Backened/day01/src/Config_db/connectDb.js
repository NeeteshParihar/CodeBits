import mongoose from 'mongoose';

async function connectDatabase(url, database){

    const dbUrl = `${url}${database}`;

    try{

        await mongoose.connect(dbUrl);
        return {
            success: true,
            message: "connected to db successfully"
        };

    }catch(err){
        return {
            success: false,
            message: 'failed to connect',
            err: err
        };
    }
}

export default connectDatabase;