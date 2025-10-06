
import problemModel from "../Schema/problems.js";
import getLanguageId from "../utils/judge0LanguageId.js";
import submitBatch from '../utils/submitBatch.js';
import  {
    getBase64Str, getUtf8FromBase64
} from '../utils/typeConversion.js';

export const createProblem = async(req, res)=>{

    try{

        const user = req.user;

        if(!user || user.role === 'admin'){
            return res.status(401).json({
                success: false,
                message: "You don't have the access to create the problems"
            })
        }

        // now we can create the problem and accept the data
        
        const {title, description, difficultyLevel, tags,visibleTestCases, hiddenTestCases, startCode, refrenceSolution } = req.body;
        const problemCreator = user._id;

       
        // for now lets consider we have added a middleware layer to varify the daya 

        // we need to check if the provided soltions are correct 
        // by checking them against input and output and running them in environment like judge0


        //  understand the output from here https://ce.judge0.com/#submissions-submission-batch-get
        // https://ce.judge0.com/#statuses-and-languages-status-get // understand status_id from here

        for( const { language, code } of refrenceSolution){

            const id = getLanguageId(language);
            // ask the compiler for the results

            const base64EncodedCode = getBase64Str(code);
            
            const submissions = visibleTestCases.map(({input, output})=>{
                return {
                    language_id: id,
                    source_code: base64EncodedCode,
                    stdin: input,
                    expected_output: output
                }
            });

            let respoonse = await submitBatch(submissions);

        }


    }catch(err){

    }
}
