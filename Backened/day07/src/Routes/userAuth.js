import express from  'express';
import { register, login, logout, profile , registerAdmin} from '../Controllers/userAuth.js';
import { validateUSerData } from '../utils/validator.js';
import { checkUserAuthentication } from '../middlewares/userAuthentication.js';


const authRouter = express.Router();

// Register


authRouter.post('/register',validateUSerData(['firstName', 'emailId', 'password']),  register);
authRouter.post('/login', validateUSerData(['emailId', 'password']),  login);
authRouter.post('/logout',checkUserAuthentication, logout);
authRouter.get('/profile',checkUserAuthentication, profile);
authRouter.post('/admin/register', checkUserAuthentication, validateUSerData(['emailId', 'password', 'firstName']), registerAdmin);

export default authRouter;

/* 

things we will handle in the userAuth route
1. login
2. signup
3. logout
4. getProfile

things we deal with 
1. password hashing
2. jwt tokens
3. Redis to store the logout tokens 

*/