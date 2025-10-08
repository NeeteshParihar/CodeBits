import userModel from "../Schema/users.js";
import { getHashedPassword, checkPassword } from "../utils/passwordHashing.js";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import redisclient from "../Config_db/redis.js";

dotenv.config({ path: './.env' });

const server_private_key = process.env['server_private_key'];
const token_expiry_time = Number.parseInt(process.env['token_expiry_time']) || 60 * 60;



export const register = async (req, res) => {

    try {

        const { firstName, emailId, password, role } = req.body;

        if (role && role === 'admin') {
            return res.status(401).json({
                success: false,
                message: "You are not Authorised for this action"
            })
        }

        const hashCode = await getHashedPassword(password);

        //  we can check if the user is already registered or not, but as emailId's is set unique the db will reject duplicacy result 
        const user = await userModel.create({
            ...req.body,
            password: hashCode
        });

        //  sending the jwt tokens to client , jwt = header.payload.digitalSignature , digitalSignature = hash(encoded header , encoded payload) -> hascode -> singed by the secred_key 

        const jwtToken = jwt.sign({ id: user._id, emailId: emailId }, server_private_key, { expiresIn: token_expiry_time });

        // sending the cookies
        res.cookie('jwtToken', jwtToken, {
            httpOnly: true,
            maxAge: token_expiry_time * 1000 // it will cleared from browser after these milliseconds
        })

        res.status(201).json({
            success: true,
            message: 'registered successfully'
        })

        // secure: true means only send it when the connection is secured by the https

    } catch (err) {


        // if error is due to emailId duplicacy

        if (err.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "A user with this email address already exists"
            })
        }

        // the mongoose throw an error object , or during our verifcation if we founds error in the data see customError.js for this 
        if (err.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: "Invalid user data",
                error: err.message
            })
        }

        // for server side errors like network problem and others


        return res.status(500).json({
            success: false,
            message: "An unexpected error occured on the server"
        })

    }

}


export const login = async (req, res) => {

    try {

        const { emailId, password } = req.body;

        const existingUser = await userModel.findOne({ emailId });

        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: "user did'nt exists, Please register first"
            })
        }

        if (!await checkPassword(password, existingUser.password)) {
            // if the passwordis not matched and user exists send 401

            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            })

        }
        // user is authenticated 

        const jwtToken = jwt.sign({ id: existingUser._id, emailId: emailId }, server_private_key, { expiresIn: token_expiry_time });

        // sending the cookies
        res.cookie('jwtToken', jwtToken, {
            httpOnly: true,
            maxAge: token_expiry_time * 1000 // it will cleared from browser after these milliseconds
        })

        res.status(200).json({
            success: true,
            message: "Logged in successfully!"
        })

    } catch (err) {

        res.status(500).json({
            success: false,
            message: "An unexpected error occured on the server"
        })

        console.log(err);
    }
}



export const logout = async (req, res) => {

    try {



        // the middle ware will make sure user is authenticated and loged in
        const user = req.user;

        const emailId = user.emailId;
        const payload = req.jwtPayload;
        const { jwtToken } = req.cookies || {};

        const multi = redisclient.multi(); // create a transaction, if the set function runs successfully but expireAt fails that will create a problem for us


        multi.set(`jwtToken:${jwtToken}`, jwtToken); // ye wala token block kardo, 
        multi.expireat(`jwtToken:${jwtToken}`, payload.exp);

        await multi.exec();

        res.clearCookie('jwtToken', {
            httpOnly: true
        });

        res.status(200).json({
            success: true,
            message: "logout  successfully"
        })

    } catch (err) {

        console.error('Error while loggin out', err);

        res.status(500).json({
            success: false,
            message: "An unexpected error occured on the server"
        })

    }
}


export const profile = async (req, res) => {

    try {

        res.status(200).json({
            success: true,
            message: "user profile"
        })

    } catch (err) {

        res.status(500).json({
            success: false,
            message: "failed to get the user profile"
        })

    }
}


export const registerAdmin = async (req, res) => {

    try {

        const user = req.user;

        if (!user || user.role === 'user') {
            return res.status(401).json({
                success: false,
                message: "You are not authorised to do this aciton"
            })
        }

        // register here

        const { emailId, password, firstName, role } = req.body;

        if (!role || role !== 'admin') {
            return res.status(400).json({
                success: false,
                message: "make sure to pass the correct role"
            })
        }

        const hashCode = await getHashedPassword(password);

        //  we can check if the user is already registered or not, but as emailId's is set unique the db will reject duplicacy result 
        const newAdmin = await userModel.create({
            ...req.body,
            password: hashCode
        });

        // we can integrate email authentication, so when a admin registors a new admin we can mail that newAdmin to register as admin so that we can make sure the newAdmin privacy, like password etc
        

        res.status(201).json({
            success: true,
            message: "new  admin registered",
            admin: {
               ...req.body
            }
        })

    } catch (err) {


        // if error is due to emailId duplicacy

        if (err.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "A user with this email address already exists"
            })
        }

        // the mongoose throw an error object , or during our verifcation if we founds error in the data see customError.js for this 
        if (err.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: "Invalid user data",
                error: err.message
            })
        }

        // for server side errors like network problem and others


        return res.status(500).json({
            success: false,
            message: "An unexpected error occured on the server"
        })


    }
}