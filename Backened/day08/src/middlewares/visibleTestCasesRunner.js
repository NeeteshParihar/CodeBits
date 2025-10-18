import problemModel from "../Schema/problems.js";
import checkTestCases from "../utils/testCaseAnalysis.js";

async function visibleTestCases(req, res, next) {

    try {

        const { language, code } = req.body;
        const {problemId} = req.params;

        const problem = await problemModel.findById(problemId).select('visibleTestCases');
        if(!problem) return res.status(404).json({success: false, message: "problem not found!" });


        const visibleTestCases = problem.visibleTestCases;

        const solutions = [{ language, code }];
        const { internalServerError, results } = await checkTestCases(solutions, visibleTestCases);

        if(internalServerError){
            return res.status(500).json({
                success: false, message: internalServerError.message,
                err: internalServerError,
                errorIn: "middlewares/visibleTestCaseRunner.js!"
            })
        }

        req.visibleTestCaseResults = results;
        next();

    } catch (err) {

        res.status(500).json({
            success: false, message: err.message, err
        })
    }

}

export default visibleTestCases;