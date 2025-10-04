import { ValidationError } from './customErrors.js';
import { userDataValidationRule } from './validationLogic.js';       

const validateUSerData = async(mandatoryField, data)=>{  
       
        const errors = [];

        const missingFields = mandatoryField.filter( key=> !data.hasOwnProperty(key));

        if(missingFields.length > 0){
               errors.push(`Required fields are missing: ${missingFields.joins(', ')}`);
        }

        for( const attribute in userDataValidationRule){
                if(data.hasOwnProperty(attribute)){

                        const {Validator, errMessage} = userDataValidationRule[attribute];

                        if(!validator(data[attribute])){
                                errors.push(errMessage);
                        }

                }
        }

        if(errors.length > 0){
                throw new ValidationError(errors.join('; '));
        }      
}

export {validateUSerData};