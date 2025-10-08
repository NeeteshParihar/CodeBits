
import getLanguageId from "./judge0LanguageId.js";
import { submitBatch, getBatchSubmission } from "./Judge0Batchprocessing.js";
import { getBase64Str, getUtf8FromBase64 } from "./typeConversion.js";


async function checkTestCases(refrenceSolution, visibleTestCases,
    hiddenTestCases = []) {

    const totalTestCases = [...visibleTestCases, ...hiddenTestCases];

    const errors = [];

    for (const { language, code } of refrenceSolution) {


        const id = getLanguageId(language);
        // ask the compiler for the results

        const submissions = totalTestCases.map(({ input, output }) => {
            return {
                language_id: id,
                source_code: getBase64Str(code),
                stdin: getBase64Str(input),
                expected_output: getBase64Str(output)
            }
        });

        // send the batch for submission
        const tokenResponse = await submitBatch(submissions); // [ {token: "fkfng"}, {token: "skgnbkgj"}] 

        const tokens = tokenResponse.map(({ token }) => token);
        // fetch the batch using recieved tokens
        const { success, submissionResult, err } = await getBatchSubmission(tokens);



        if (!success) {
            errors.push({
                success: false,
                message: "Error while fetching batch submission",
                err
            })
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

        for (let i = 0; i < submissionResult.length && success; i++) {

            const testResult = submissionResult[i];

            if (testResult.status_id > 3) {

                errors.push({
                    success: false,
                    message: `Error occured running the ${i}th testCase, ${(i < visibleTestCases.length) ? "error in visible testCase" : "Error in hiddent case"}, index: ${i % (visibleTestCases.length)}`,
                    result: {
                        ...submissionResult[i],
                        source_code: getUtf8FromBase64(submissionResult[i].source_code || " "),
                        stdin: getUtf8FromBase64(submissionResult[i].stdin || ""),
                        stdout: getUtf8FromBase64(submissionResult[i].stdout || ""),
                        expected_output: getUtf8FromBase64(submissionResult[i].expected_output)
                    },
                })

            } else if (testResult.status_id < 3) {

                errors.push({
                    success: false,
                    message: `Error occured running the ${i}th testCase, ${(i < visibleTestCases.length) ? "error in visible testCase" : "Error in hiddent case"}, index: ${i % (visibleTestCases.length)}`,
                    result: {
                        ...submissionResult[i],
                        source_code: getUtf8FromBase64(submissionResult[i].source_code),
                        stdin: getUtf8FromBase64(submissionResult[i].stdin),
                        stdout: getUtf8FromBase64(submissionResult[i].stdout),
                        expected_output: getUtf8FromBase64(submissionResult[i].expected_output)

                    },
                })

            }

        }



    }

    return errors;
}

export default checkTestCases;