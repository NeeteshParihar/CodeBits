import userModel from "../Schema/users.js";
import { validateUSerData } from "../utils/validator.js";
import { getHashedPassword, checkPassword } from "../utils/passwordHashing.js";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import redisclient from "../Config_db/redis.js";

dotenv.config({ path: './.env' });

const server_private_key = process.env['server_private_key'];
const token_expiry_time = Number.parseInt(process.env['token_expiry_time']) || 60 * 60;


const register = async (req, res) => {

    try {

        //  we just need there attributes to register the user, other data can be taken later
        validateUSerData(['firstName', 'emailId', 'password'], req.body );
        const { firstName, emailId, password } = req.body;

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

        console.error(err);

        return res.status(500).json({
            success: false,
            message: "An unexpected error occured on the server"
        })

    }

}


const login = async (req, res) => {

    try {

        const { emailId, password } = req.body;

        validateUSerData(['emailId']);
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

        if (err.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: "Invalid user data",
                error: err.message
            })
        }

        res.status(500).json({
            success: false,
            message: "An unexpected error occured on the server"
        })
    }
}



const logout = async (req, res) => {

    try {
        const jwtToken = req.cookie? req.cookies.jwtToken:undefined ;
        const payload = jwt.verify(jwtToken); // we have used verify here because the data should be verified and its origin should be checked with digital signature

        const emailId = payload.emailId;
        const exp = payload.exp;

        const multi = redisclient.multi(); // create a transaction, if the set function runs successfully but expireAt fails that will create a problem for us

        multi.set(`logout:jwtToken:user:${emailId}`, accessToken);
        multi.expireat(`logout:jwtToken:user:${emailId}`, exp);

        await multi.exec();
        
        res.clearCookie('jwtToken',{
            httpOnly: true
        });
        

    } catch (err) {

        // check for jwt error like invalid or others to send 400 code 

        if (err.name === 'TokenExpiredError') {
           
            res.clearCookie('jwtToken', { httpOnly: true });
            return res.status(200).json({ success: true, message: 'Token expired, user logged out.' });
        }

        if (err.name === 'JsonWebTokenError') {
            // The token is invalid (bad signature, etc.)
            return res.status(401).json({
                success: false,
                message: 'Invalid token. Please log in again.'
            });
        }

        console.error('Error while loggin out', err);

        res.status(500).json({
            success: false,
            message: "An unexpected error occured on the server"
        })

    }
}

