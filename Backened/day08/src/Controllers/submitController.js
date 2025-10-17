
import submissionModel from "../Schema/Submission.js";
import problemModel from '../Schema/problems.js';
import checkTestCases from '../utils/testCaseAnalysis.js';




export const submitCode = async (req, res) => {

    try {

        const { internalServerErrorVisibleTestCases,
            internalServerErrorHiddenTestCases,
            SubmissionId, visibleTestCaseResults,
            hiddenTestCaseResults, visibleTestCasesLength, hiddenTestCasesLength } = req;

        if (internalServerErrorVisibleTestCases || internalServerErrorHiddenTestCases) {

            // update the submission record
            await submissionModel.updateOne({ _id: SubmissionId }, {
                $set: { status: { id: -1, description: "Internal Server Error" } }
            })

            console.error('error while');
            console.error(internalServerErrorHiddenTestCases);
            console.error(internalServerErrorVisibleTestCases);

            return res.status(500).json({
                success: false, message: 'Internal server error'
            })

        }   



        const errors = [];

        const totalTestCases = visibleTestCasesLength+hiddenTestCasesLength;

        let maxRunTime = 0, maxMemory = 0;
        let testCasesPassed = 0

        const results = [...visibleTestCaseResults, ...hiddenTestCaseResults];

        results.forEach((testResult, index) => {

            index = index % totalTestCases;

            const { memory, time } = testResult;

            maxMemory = Math.max(maxMemory, memory || 0);
            maxRunTime = Math.max(maxRunTime, time || 0);

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

                })
            } else {
                testCasesPassed++;
            }
        })


        if (errors.length > 0) {

            const testResult = errors[0];

            console.log(testResult);


            await submissionModel.updateOne({
                _id: SubmissionId
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
            _id: SubmissionId
        }, {
            $set: {
                status: results[0].status,
                runtime: maxRunTime,
                memory: maxMemory,
                testCasesPassed: testCasesPassed,
                totalTestCases: totalTestCases
            }
        })


        res.status(201).json({

            success: true,
            testCasesPassed: totalTestCases,
            totalTestCases: totalTestCases,
            desciption: "ACCEPTED!",
            code,
            language,
            memory: maxMemory,
            runtime: maxRunTime
        })


    } catch (err) {

        return res.status(500).json({
            success: false, message: "sorry for inconvieniece, There was an internal server error!",
            err: err.message
        })
    }

}

