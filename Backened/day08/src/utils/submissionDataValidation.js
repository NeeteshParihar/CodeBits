import { submissionValidationRule } from "./validationLogic.js";

export function submissionDataValidation(mandatoryField = Object.keys(submissionValidationRule)) {

    return async (req, res, next) => {

        try {

            
            if (!req.body) {
                return res.status(400).json({
                    success: false, message: "No data is provided"
                })
            }


            const { language, code } = req.body ;
            const { problemId} = req.params;

            const data = { language, code, problemId };


            const errors = [];
            const missingFields = mandatoryField.filter((field) => !data.hasOwnProperty(field));


            if (missingFields.length > 0) {
                errors.push(`missing mandatory fields ${missingFields.join(',')};`)
            }



            for (let key in submissionValidationRule) {

                if (data.hasOwnProperty(key)) {

                    const validationObj = submissionValidationRule[key];

                    if (!validationObj.validator(data[key])) {
                        errors.push(validationObj.errMessage())
                    }
                }
            }


            if (errors.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Data validation failed',
                    err: errors.join('; ')
                })
            }


            next(); // data is validated 

        } catch (err) {

            res.status(500).json({
                success: false,
                message: err.message,
                err: err
            })
        }

    }


}