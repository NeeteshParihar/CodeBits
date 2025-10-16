
import getLanguageId from "./judge0LanguageId.js";
import { submitBatch, getBatchSubmission } from "./Judge0Batchprocessing.js";
import { getBase64Str, getUtf8FromBase64 } from "./typeConversion.js";


async function checkTestCases(refrenceSolution, visibleTestCases,
    hiddenTestCases = []) {

    const totalTestCases = [...visibleTestCases, ...hiddenTestCases];

    const ans = {
        internalServerError: null, // internal server error
        results: []
    }

    try {


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
            const { internalServerError: err, tokenResponse } = await submitBatch(submissions); // [ {token: "fkfng"}, {token: "skgnbkgj"}] 

            if (err) {
                ans.internalServerError = err;
                break;
            }


            const tokens = tokenResponse.map(({ token }) => token);
            // fetch the batch using recieved tokens
            let { internalServerError, results } = await getBatchSubmission(tokens);


            if (internalServerError) {
                ans.internalServerError = internalServerError;
                break;
            }


            results = results.map((testResult) => {
                return {
                    ...testResult,
                    source_code: getUtf8FromBase64(testResult.source_code),
                    stdin: getUtf8FromBase64(testResult.stdin),
                    stdout: getUtf8FromBase64(testResult.stdout),
                    expected_output: getUtf8FromBase64(testResult.expected_output),
                    compile_output: getUtf8FromBase64(testResult.compile_output)
                }
            })


            ans.results = [ ...ans.results, ...results];
        }

        return ans;

    } catch (err) {
      
        return {
            internalServerError: err
        }
    }

  
}

export default checkTestCases;