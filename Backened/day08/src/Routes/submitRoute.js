import express from "express";
import { checkUserAuthentication } from "../middlewares/userAuthentication.js";
import { submitCode } from "../Controllers/submitController.js";
import { submissionDataValidation } from "../utils/submissionDataValidation.js";
import visibleTestCases from '../middlewares/visibleTestCasesRunner.js';
import hiddenTestCases from '../middlewares/hiddendTestCasesRunner.js';
import checkProblemInDb from '../middlewares/checkProblemExistence.js';
import saveSubmission from "../middlewares/saveSubmission.js";


const submitRouter = express.Router();

//<--------------------  define the submit route here------------------->

// run and submit , fetching the submission details
//  no update , delete operation permitted once written its only readable 

// we can define a middleware called run which only runs the users solution of a particular id on visible test cases or hidden testCases 

// we will send the data that is needed to save the submission, but before that we need to run the code 
submitRouter.post('/submit/:problemId',
    checkUserAuthentication, submissionDataValidation(),
    checkProblemInDb, saveSubmission,
    visibleTestCases, hiddenTestCases, submitCode);

export default submitRouter;

