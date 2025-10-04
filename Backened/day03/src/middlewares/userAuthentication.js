import redisclient from "../Config_db/redis.js"
import jwt from "jsonwebtoken"
import dotenv from 'dotenv';
import userModel from "../Schema/users.js";

dotenv.config({ path: './.env'});

const server_private_key = process.env['server_private_key'];

const checkUserAuthentication = async(req, res, next)=>{

    try{


        const {jwtToken} = req.cookies || {};
        const payload = jwt.verify(jwtToken, server_private_key);

        // if the user has the token and its valid        
        const isblocked = await redisclient.get(`logout:jwtToken:user:${payload.emailId}`);

        console.log(isblocked);

        if(isblocked){

            return res.status(401).json({
                success: false,
                message: "authentication error"
            })
        }

        // if the jwt token is not blocked and valid, check if user has not deleted itself
        const user = await userModel.findById( payload.id);

        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        req.user = user;    
        req.jwtPayload = payload;         

        next();

    }catch(err){


         if (err.name === 'TokenExpiredError') {
           
            res.clearCookie('jwtToken', { httpOnly: true });
            return res.status(401).json({ success: false, message: 'Token expired, user logged out.' });
        }

        if (err.name === 'JsonWebTokenError') {
            // The token is invalid (bad signature, etc.)
            return res.status(401).json({
                success: false,
                message: 'Invalid token. Please log in again.'
            });
        }

        console.error("erorr during authenticaion");

        res.status(500).json({
            success: false,
            message: "An unexpected error occured on the server"
        })
    }   

}

export {
    checkUserAuthentication
}