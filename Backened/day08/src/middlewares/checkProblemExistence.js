import problemModel from "../Schema/problems.js"

 const checkProblemInDb = async(req, res, next)=>{
    try{

        const {problemId} = {
            ...req.body, ...req.query, ...req.params
        }
        

        const problem = await problemModel.findById(problemId);

        if(!problem){
            return res.status(404).json({
                success: false, message: "Problem Not found!"
            })
        }



        next();
      
    }catch(err){

        return res.status(500).json({
            success: false, message: err.message, err
        })

    }
}

export default checkProblemInDb;