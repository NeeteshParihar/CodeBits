import express from "express";
import { checkUserAuthentication } from "../middlewares/userAuthentication.js";
import problemDataValidator from "../utils/problemDataValidationLogic.js";
import { createProblem } from "../Controllers/problemsControllers.js";

const problemsRouter = express.Router();

//create a problem
// update a problem
// delete a problem
// get the problem 

// path --> leetcode.com/problems/create
problemsRouter.post('/create',checkUserAuthentication, problemDataValidator(), createProblem);
/* problemsRouter.delete('/:id',checkUserAuthentication, deleteProblemById);
problemsRouter.patch('/:id',checkUserAuthentication, updateProblemById);

// path --> leetcode.com/problems/1231343ewfe334
problemsRouter.get('/:id', getProblemById );
problemsRouter.get('/', getAllProblems);
// we can get porblem on the basis of the tag
// we can get on the basis of difficulty
problemsRouter.get('/user', getSolvedProblems); */


export default problemsRouter;