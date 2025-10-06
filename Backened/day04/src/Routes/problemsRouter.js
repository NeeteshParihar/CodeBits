import express from "express";
import { checkUserAuthentication } from "../middlewares/userAuthentication";

const problemsRouter = express.Router();

//create a problem
// update a problem
// delete a problem
// get the problem 

// path --> leetcode.com/problems/create
problemsRouter.post('/create',checkUserAuthentication,  createProblem);
problemsRouter.delete('/:id',checkUserAuthentication, deleteProblem);
problemsRouter.patch('/:id',checkUserAuthentication, updateProblem);

// path --> leetcode.com/problems/1231343ewfe334
problemsRouter.get('/:id', getProblem );
problemsRouter.get('/', getAllProblems);
// we can get porblem on the basis of the tag
// we can get on the basis of difficulty
problemsRouter.get('/user', getSolvedProblems);


export default problemsRouter;