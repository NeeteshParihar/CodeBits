
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


        const errors = await checkTestCases(refrenceSolution, visibleTestCases);

        if (errors.length > 1) {

            const statusCode = errors[0].statusCode;          

            return res.status(statusCode).json({
                success: false,
                errs: errors
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
            message: "problem is not submitted successfully",
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
        const isExist = await problemModel.find({_id: id});

        if(!isExist){
            return res.status(404).json({
                success: false, message: `problem with id ${id} does'nt exists`
            })
        }

        // the data is validated by the middleware
        const { title, description, difficultyLevel,
            tags, visibleTestCases,
            hiddenTestCases, startCode, refrenceSolution } = req.body;
        const problemCreator = user._id; // the user which updating it  
        

        const errors = await checkTestCases(refrenceSolution, visibleTestCases, hiddenTestCases);

       
        if (errors.length > 1) {

            const statusCode = errors[0].statusCode;         

            return res.status(statusCode).json({
                success: false,
                errs: errors
            })

        }

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

        const problem = await problemModel.findById(id); // return null or object

        if(!problem){
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


        let {page} = req.query;

        const previousCount = page*10; // page = 0, 1 ,2 ...

        const problems = await problemModel.find({}, {hiddenTestCases: 0, problemCreator: 0}).skip(previousCount).limit(10);  

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

