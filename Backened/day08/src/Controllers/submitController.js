
import { model } from "mongoose";
import submissionModel from "../Schema/Submission.js";
import problemModel from '../Schema/problems.js';
import checkTestCases from '../utils/testCaseAnalysis.js';


export const submitCode = async (req, res) => {

    try {

        const {
            submissionId, visibleTestCaseResults,
            hiddenTestCaseResults } = req;

        const visibleTestCasesLength = visibleTestCaseResults.length;
        const hiddenTestCasesLength = hiddenTestCaseResults.length;

        const { language, code } = req.body;

        const errors = [];

        const totalTestCases = visibleTestCasesLength + hiddenTestCasesLength;

        let maxRunTime = 0, maxMemory = 0;
        let testCasesPassed = 0

        const results = [...visibleTestCaseResults, ...hiddenTestCaseResults];


        results.forEach((testResult, index) => {


            if (testResult.status.id < 3 || testResult.status.id > 3) {

                errors.push({
                    status: testResult.status,
                    TestCaseEror: {
                        errorIn: (index >= visibleTestCasesLength) ? "hiddenTestCase" : "visibleTestCase",
                        index: (index >= visibleTestCasesLength) ? index - visibleTestCasesLength : index
                    },
                    languageId: testResult.language_id,
                    code: testResult.source_code,
                    stdin: testResult.stdin,
                    stdout: testResult.stdout,
                    expectedOutput: testResult.expected_output,
                    compileOutput: testResult.compile_output,
                    stderr: testResult.stderr,
                    message: testResult.message
                })
            } else {
                testCasesPassed++;               
            }

            const { memory, time } = testResult;          


            maxMemory = Math.max(maxMemory, Number(memory) || 0); // inkbs
            maxRunTime += Number(time*1000) || 0;  // in milliseconds
        })




        if (errors.length > 0) {

            const testResult = errors[0];

            await submissionModel.updateOne({
                _id: submissionId
            }, {
                $set: {
                    status: testResult.status,
                    testCasesPassed: testCasesPassed,
                    totalTestCases: totalTestCases,
                    errorMessage: testResult.status.description
                }
            }, {runValidators: true})


            return res.status(201).json({
                success: false, message: "NOT ACCEPTED!",
                result: {
                    status: testResult.status,
                    testCasesPassed: testCasesPassed,
                    totalTestCases: totalTestCases,
                    compileOutput: testResult.compileOutput,
                    stderr: testResult.stderr,
                    message: testResult.message                    
                }
            })

        }



        console.log(maxRunTime, typeof maxRunTime);

        await submissionModel.updateOne({
            _id: submissionId
        }, {
            $set: {
                status: results[0].status,
                runtime: maxRunTime,
                memory: maxMemory,
                testCasesPassed: testCasesPassed,
                totalTestCases: totalTestCases
            }
        }, {runValidators: true});


        console.log("making the results");


        res.status(201).json({

            success: true,
            status: results[0].status || {
                id: 3,
                description: "Accepted"
            },
            testCasesPassed: totalTestCases,
            totalTestCases: totalTestCases,
            language, code,
            memory: maxMemory,
            runtime: maxRunTime
        })


    } catch (err) {

        return res.status(500).json({
            success: false, message: "sorry for inconvieniece, There was an internal server error!",
            err: err.message,
            errorIn: "submitController/submitCode"
        })
    }

}

export const runCode = async (req, res) => {
    try {

        const results= req.visibleTestCaseResults ;
    
        const modifiedResult = results.map((testResult) => {

            return {
                status: testResult.status,
                stdin: testResult.stdin,
                stdout: testResult.stdout,
                expectedOutput: testResult.expected_output,
                compileOutput: testResult.compile_output,
                stderr: testResult.stderr,
                message: testResult.message
            }
        })


        res.status(200).json({
            success: true,
            results: modifiedResult
        })

    } catch (err) {

        res.status(500).json({
            success: false, message: err.messsage, errorIn: 'submitController/runCode',

            err: err
        })
    }
}

