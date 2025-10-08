
import problemModel from "../Schema/problems.js";
import getLanguageId from "../utils/judge0LanguageId.js";
import { submitBatch, getBatchSubmission } from '../utils/Judge0Batchprocessing.js';
import {
    getBase64Str, getUtf8FromBase64
} from '../utils/typeConversion.js';

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


        // for now lets consider we have added a middleware layer to varify the data

        // we need to check if the provided soltions are correct 
        // by checking them against input and output and running them in environment like judge0


        //  understand the output from here https://ce.judge0.com/#submissions-submission-batch-get
        // https://ce.judge0.com/#statuses-and-languages-status-get // understand status_id from here

        for (const { language, code } of refrenceSolution) {


            const id = getLanguageId(language);
            // ask the compiler for the results

            const submissions = visibleTestCases.map(({ input, output }) => {
                return {
                    language_id: id,
                    source_code: getBase64Str(code),
                    stdin: getBase64Str(input),
                    expected_output: getBase64Str(output)
                }
            });

            const tokenResponse = await submitBatch(submissions); // [ {token: "fkfng"}, {token: "skgnbkgj"}] 


            const tokens = tokenResponse.map(({ token }) => token);
            const { success, submissionResult, err } = await getBatchSubmission(tokens);

            

            if (!success) {
                throw new Error(err);
            }



            /* 
            
            {
                  "language_id": 46,
                  "stdout": "hello from Bash\n",
                  "status_id": 3,
                  "stderr": null,
                  "token": "db54881d-bcf5-4c7b-a2e3-d33fe7e25de7"
                  and more properties...
            }

            each submission looks like this

            */

            // console.log(Array.isArray(submissionResult));
            // console.log(submissionResult[0]);

            for (let i = 0; i < submissionResult.length; i++) {

                const testResult = submissionResult[i];

                if (testResult.status_id > 3) {
                    return res.status(400).json({
                        success: false,
                        message: `Error occured running the ${i}th testCase`,
                        result: {
                            ...submissionResult[i],
                            source_code: getUtf8FromBase64(submissionResult[i].source_code || " "),
                            stdin: getUtf8FromBase64(submissionResult[i].stdin || ""),
                            stdout: getUtf8FromBase64(submissionResult[i].stdout || "")
                        },

                    })
                } else if (testResult.status_id < 3) {
                    return res.status(400).json({
                        success: false,
                        message: `the solution is not optimal ${i}th testCase`,
                         result: {
                            ...submissionResult[i],
                            source_code: getUtf8FromBase64(submissionResult[i].source_code),
                            stdin: getUtf8FromBase64(submissionResult[i].stdin),
                            stdout: getUtf8FromBase64(submissionResult[i].stdout)
                        },
                    })
                }

            }



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
            createdProblem: newProblem
        })


    } catch (err) {

        res.status(500).json({
            success: true,
            message: "problem is not submitted successfully",
            err: err
        })
    }
}
