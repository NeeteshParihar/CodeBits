import submissionModel from "../Schema/Submission.js";

 const saveSubmission = async(req, res, next)=>{
    try{

        const userId = req.user._id;
        const {problemId} = req.params;
        const {language, code} = req.body;

        // save the submission 

      

        const newSubmission = await submissionModel.create({
            userId, problemId, code, language, status: { id: 1, description: "pending" }
        });

     

        req.submissionId = newSubmission._id;

        next();
      
    }catch(err){

        res.status(500).json({
            success: false, message: "internal server error!"
        })

    }
}

export default saveSubmission;