import problemModel from "../Schema/problems.js";
import checkTestCases from "../utils/testCaseAnalysis.js";
import submissionModel from "../Schema/Submission.js";

async function hiddenTestCases(req, res, next) {

    try {

        // data is already validated 
        const { language, code } = req.body;
        const { problemId } = req.params;


        const problem = await problemModel.findById(problemId).select('hiddenTestCases');
        if (!problem) return res.status(404).json({ success: false, message: "problem not found!" });

        const hiddenTestCases = problem.hiddenTestCases;

        const solutions = [{ language, code }];
        const { internalServerError, results } = await checkTestCases(solutions,  [], hiddenTestCases);

        if(internalServerError){
            return res.status(500).json({
                success: false, message: internalServerError.message,
                err: internalServerError,
                errorIn: "hiddenTestCaseMiddleWare"
            })
        }
        req.hiddenTestCaseResults = results;
        next();

    } catch (err) {

        res.status(500).json({
            success: false, message: err.message, err
        })
    }

}

export default hiddenTestCases;