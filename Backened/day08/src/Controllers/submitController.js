
import submissionModel from "../Schema/Submission.js";
import problemModel from '../Schema/problems.js';
import { isValidObjectId } from '../utils/validateMongoObjectId.js';
import getLanguageId from "../utils/judge0LanguageId.js";
import checkTestCases from '../utils/testCaseAnalysis.js';




export const submitCode = async (req, res) => {

    try {

        const userId = req.user._id;
        const problemId = req.params.id; // we need to verify this

        const { code, language } = req.body;

        if (!isValidObjectId(problemId)) {
            return res.status(400).json({
                success: false, message: `${id} is not a valid objectId`
            })
        }



        if (!code || !language) {
            return res.status(400).json({
                success: false, message: `code: ${code}, langauge: ${language} are not valid`
            })
        }

        // save , run with polling and then i have to update it
        // the status is pending still
        const newSubmission = await submissionModel.create({
            userId, problemId, code, language, status: { id:1, description: "pending" }
        })

        // get the hidden test cases from problem,
        // run the test cases against the code 

        const includedFields = ['visibleTestCases', 'hiddenTestCases'];
        const queryStr = includedFields.join(' ');
        const testCases = await problemModel.findById(problemId).select(queryStr);

        const languageId = getLanguageId(language);

        if (!language) {
            return res.status(400).json({
                success: false,
                message: "provided langauge is not supported, try to submit in available languages"
            })
        }

        const solution = [{ language, code }];
        const { internalServerError, results } = await checkTestCases(solution, testCases.visibleTestCases, testCases.hiddenTestCases);


        if (internalServerError) {

            await submissionModel.updateOne({ _id: newSubmission._id }, { $set: { "status.description": "internalServerError" } });

            return res.status(500).json({
                success: false, message: "Internal server error", errMsg: internalServerError.message
            })
        }


        const errors = [];
        const totalTestCases = testCases.visibleTestCases.length + testCases.hiddenTestCases.length;

        let maxRunTime = 0, maxMemory = 0;
        let testCasesPassed = 0

        results.forEach((testResult, index) => {

            index = index % totalTestCases;

            maxMemory = Math.max(maxMemory, memory || 0);
            maxRunTime = Math.max(maxRunTime, time || 0);

            if (testResult.status.id < 3 || testResult.status.id > 3) {

                errors.push({
                    status: testResult.status,
                    TestCaseEror: {
                        errorIn: (index >= visibleTestCases.length) ? "hiddenTestCase" : "visibleTestCase",
                        index: (index >= visibleTestCases.length) ? index - visibleTestCases.length : index
                    },
                    languageId: testResult.language_id,
                    code: testResult.source_code,
                    stdin: testResult.stdin,
                    stdout: testResult.stdout,
                    expectedOutput: testResult.expected_output,
                    compileOutput: testResult.compile_output,

                })
            }else{
                testCasesPassed++;
            }
        })


        if (errors.length > 0) {

            const testResult = errors[0];

            await submissionModel.updateOne({
                _id: newSubmission._id
            }, {
                $set: {
                    status: testResult.status,                  
                    testCasesPassed: testCasesPassed,
                    totalTestCases: totalTestCases,
                    errorMessage: testResult.status.description
                }
            })


            return res.status(201).json({
                success: false, message: "NOT ACCEPTED!",
                result: testResult
            })

        }

        await submissionModel.updateOne({
            _id: newSubmission._id
        }, {
            $set: {
                status: results.status,
                runtime: maxRunTime,
                memory: maxMemory,
                testCasesPassed: totalTestCases,
                totalTestCases: totalTestCases
            }
        })


        res.status(201).json({

            success: true,
            testCasesPassed: totalTestCases,
            totalTestCases: totalTestCases,
            desciption: "ACCEPTED!",
            code,
            language
        })


    } catch (err) {

        return res.status(500).json({
            success: false, message: "sorry for inconvieniece, There was an internal server error!",
            err: err.message
        })
    }

}

