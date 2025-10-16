
import problemModel from "../Schema/problems.js";
import mongoose from "mongoose";
import checkTestCases from '../utils/testCaseAnalysis.js';

export const createProblem = async (req, res) => {

    try {


        const user = req.user;

        if (!user || user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: "You don't have the access to create the problems"
            })
        }

        // now we can create the problem and accept the data

        const { title, description, difficultyLevel,
            tags, visibleTestCases,
            hiddenTestCases, startCode, refrenceSolution } = req.body;
        const problemCreator = user._id;

        // check if this title is already exists or not 

        const isExist = await problemModel.exists({ title });

        if (isExist) {
            return res.status(409).json({
                success: false,
                message: `problem with this title: "${title}" already exists`
            })
        }

        // for now lets consider we have added a middleware layer to varify the data

        // we need to check if the provided soltions are correct 
        // by checking them against input and output and running them in environment like judge0


        //  understand the output from here https://ce.judge0.com/#submissions-submission-batch-get
        // https://ce.judge0.com/#statuses-and-languages-status-get // understand status_id from here


        const { internalServerError, results } = await checkTestCases(refrenceSolution, visibleTestCases, hiddenTestCases);
       
        if (internalServerError) {
            return res.status(500).json({
                success: false, message: "Internal server error", errMsg: internalServerError.message
            })
        }

        const errors =  [];
        const totalTestCases  = visibleTestCases.length + hiddenTestCases.length;
       
         results.forEach((testResult, index)=>{

            index = index % totalTestCases;

            if(testResult.status.id < 3 || testResult.status.id > 3){

                errors.push({
                    status: testResult.status,
                     TestCaseEror:{
                        errorIn: (index >= visibleTestCases.length)? "hiddenTestCase": "visibleTestCase",
                        index: (index >= visibleTestCases.length)? index - visibleTestCases.length : index 
                    },
                    languageId: testResult.language_id,
                    code: testResult.source_code,
                    stdin: testResult.stdin,
                    stdout: testResult.stdout,
                    expectedOutput: testResult.expected_output,
                    compileOutput : testResult.compile_output,                   

                })
            }
        })

        if(errors.length > 1){
            return res.status(400).json({
                success: false, message: "NOT SUBMITTED!",
                err: errors
            })
        }

        // if all the testCases runs successfully
        // create the new problem 

        const newProblem = await problemModel.create({
            title, description, difficultyLevel,
            tags, visibleTestCases,
            hiddenTestCases, startCode, refrenceSolution,
            problemCreator
        })

        res.status(200).json({
            success: true,
            message: "problem is submitted successfully",
            Problem: newProblem
        })


    } catch (err) {

        res.status(500).json({
            success: false,
            message: "Internal server error, problem is not submitted",
            err: err
        })
    }
}


// route --> /problem/:id
export const deleteProblemById = async (req, res) => {
    try {


        const user = req.user;

        if (!user || user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: "You don't have the access to create the problems"
            })
        }


        // the data is validated 
        const { id } = req.params || {};

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: `${id} is not a valid mongodb id`
            })
        }

        const deletedProblem = await problemModel.findByIdAndDelete(id); // returns deleted problme or null if not found 

        if (!deletedProblem) {
            return res.status(404).json({
                success: false,
                message: "The problem with this id does'nt exists"
            })
        }

        res.status(200).json({
            success: true,
            message: "problem Deleted successfully",
            problem: deletedProblem
        })

    } catch (err) {



        res.status(500).json({
            success: flase,
            message: "problem is not submitted successfully",
            err: err
        })
    }
}

// route-> problem/:id
export const updateProblemById = async (req, res) => {
    try {

        const user = req.user;

        if (!user || user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: "You don't have the access to create the problems"
            })
        }

        // the data is validated 
        const { id } = req.params || {};

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: `${id} is not a valid mongodb id`
            })
        }

        // check if the problem exist or not if not we can save the processing
        const isExist = await problemModel.find({ _id: id });

        if (!isExist) {
            return res.status(404).json({
                success: false, message: `problem with id ${id} does'nt exists`
            })
        }

        // the data is validated by the middleware
        const { title, description, difficultyLevel,
            tags, visibleTestCases,
            hiddenTestCases, startCode, refrenceSolution } = req.body;
        const problemCreator = user._id; // the user which updating it  


       const { internalServerError, results } = await checkTestCases(refrenceSolution, visibleTestCases, hiddenTestCases);

        if (internalServerError) {
            return res.status(500).json({
                success: false, message: "Internal server error", errMsg: internalServerError.message
            })
        }


        const errors =  [];
        const totalTestCases  = visibleTestCases.length + hiddenTestCases.length;
       
         results.forEach((testResult, index)=>{

            index = index % totalTestCases; // ...., ...., ..... --> different langauge soln, so we normalize the index  for total testCases means "...."

            if(testResult.status.id < 3 || testResult.status.id > 3){

                errors.push({
                    status: testResult.status,
                     TestCaseEror:{
                        errorIn: (index >= visibleTestCases.length)? "hiddenTestCase": "visibleTestCase",
                        index: (index >= visibleTestCases.length)? index - visibleTestCases.length : index 
                    },
                    languageId: testResult.language_id,
                    code: testResult.source_code,
                    stdin: testResult.stdin,
                    stdout: testResult.stdout,
                    expectedOutput: testResult.expected_output,
                    compileOutput : testResult.compile_output,                   

                })
            }
        })

        if(errors.length > 1){
            return res.status(400).json({
                success: false, message: "NOT SUBMITTED!",
                err: errors
            })
        }

        // if all the testCases runs successfully
        // create the new problem 

        // this method finishes the task in one atomic unit 
        const updatedProblem = await problemModel.findByIdAndUpdate(id, {
            title, description, difficultyLevel,
            tags, visibleTestCases,
            hiddenTestCases, startCode, refrenceSolution
        }, { new: true, runValidators: true });


        // it will return null if no id is found  or it will return updated object if id matched dure ot new: true

        if (!updatedProblem) {
            return res.status(404).json({
                success: false,
                message: "Problem does'nt exists"
            })
        }

        // else a the problem gets updated and 

        res.status(200).json({
            success: true,
            message: "Updated successFully",
            Problem: updatedProblem
        })

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error, no changes done to the problem",
            err: err
        })
    }
}

// route --> problem/:id
export const getProblemById = async (req, res) => {
    try {

        // the data is validated 
        const { id } = req.params || {};

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: `${id} is not a valid mongodb id`
            })
        }

        // const problem = await problemModel.findById(id, {hiddenTestCases: 0, problemCreator: 0, refrenceSolution: 0}); // return null or object

        // there is another way of doing this 
        // if i want to avoid a field then add '-' as prefix to it, and 
        // if we passes a empty string it will just give all the fields
        // we we passes only -field it will give object without them
        // if we passes field with no-sign it will give only those fields

        // const excludingFields = [ /* 'visibleTestCases.explanation' */, 'hiddenTestCases', "problemCreator", "refrenceSolution"];
        // const selectStr = excludingFields.map((field)=> `-${field}`).join(' ');

        // //  we gets the string as : ' -visibleTestCases.explanation -hiddenTestCases -problemCreator -refrenceSolution',
        // // if we want to avoid something inside a nested Object for example visibelTestCases.explanation --> -visibelTestCases.explanation

        const includedFields = ['_id', 'title', 'description', 'difficultyLevel', 'visibleTestCases', 'startCode', 'tags'];
        const problem = await problemModel.findById(id).select(includedFields.join(' '));

        if (!problem) {
            return res.status(404).json({
                success: false, message: `Problem not found`
            })
        }

        res.status(200).json({
            success: true,
            message: "Problem  found!",
            problem: problem
        })

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Unexpected server error",
            err: err
        })
    }
}


// problems/all?page=1 , default limit is 10 
export const getAllProblems = async (req, res) => {
    try {


        // we should not deliver all the problems at once, we can use pagination to 
        // send the data 

        //  route -->  /probelms?page=1&limit=10 , from first page send me the 10 problems
        // means find().skip(val).limit(val), here val = total problems we want to skip from first problem like 10 , 20 etc 
        // server solution , only send 10 problems first, so request like /probelms?page=0&limi=10
        // means skip = 0*10 = 0 and give ne next problems
        // when page = 1, skip = 1*10 and give me next 10 objects or probelms 

        let { page } = req.query;

        if (!page && page != 0) page = 0;

        const previousCount = page * 10; // page = 0, 1 ,2 ...

        const includedFields = ['_id', 'title', 'difficultyLevel', 'tags']; // we just need these information to show, when the user clicks in we can again fetch the particular id


        // const problems = await problemModel.find({}, {hiddenTestCases: false, problemCreator: false, refrenceSolution: false}).skip(previousCount).limit(10);  

        const problems = await problemModel.find({}).select(includedFields.join(' ')).skip(previousCount).limit(10);

        res.status(200).json({
            success: true, message: "fetched all problems",
            problems
        })


    } catch (err) {


        res.status(500).json({
            success: false,
            message: "Server error",
            err: err
        })
    }
}

export const getSolvedProblems = async (req, res) => {
    try {


        const user = req.user;

        if (!user || user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: "You don't have the access to create the problems"
            })
        }

        res.status(200).json({
            success: true,
            message: "problem is  submitted successfully",
        })

    } catch (err) {
        res.status(500).json({
            success: flase,
            message: "problem is not submitted successfully",
            err: err
        })
    }
}

