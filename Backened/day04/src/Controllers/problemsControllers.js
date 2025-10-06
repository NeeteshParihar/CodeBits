
import problemModel from "../Schema/problems.js";


export const createProblem = async(req, res)=>{

    try{

        const user = req.user;

        if(!user || user.role === 'admin'){
            return res.status(401).json({
                success: false,
                message: "You don't have the access"
            })
        }
        


    }catch(err){

    }
}
