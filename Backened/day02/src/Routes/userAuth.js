import express from  'express';

const authRouter = express.Router();

// Register


authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.get('/profile', getProfile);


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