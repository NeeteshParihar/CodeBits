import { problemDataValidationRule } from "./validationLogic.js";

function problemDataValidator(mandatoryField = Object.keys(problemDataValidationRule)){
    
    return async(req, res, next)=>{

        try{
           

            const data = req.body;


            if(!data){
                return res.status(400).json({
                    success: false,
                    message: "No data is provided"
                })
            }

            const errors = [];
            const missingFields = mandatoryField.filter( ( field)=> !data.hasOwnProperty(field) );

            if(missingFields.length > 0){
                errors.push( `missing mandatory fields ${missingFields.join(',')};`)
            }

            for( let key in problemDataValidationRule){
                if(data.hasOwnProperty(key)){

                    const {validator, errMessage} = problemDataValidationRule[key];

                    if(!validator(data[key])){
                        errors.push(errMessage)
                    }
                }
            }

            if(errors.length > 0){
               return res.status(400).json({
                    success: false,
                    message: 'Data validation failed',
                    err: errors.join('; ')
                })
            }

            next(); // data is validated 
        }catch(err){

            res.status(500).json({
                    success: false,
                    message: err.message,
                    err: err                   
            })
        }
    }
}

export default problemDataValidator;