import { ValidationError } from './customErrors.js';
import { userDataValidationRule } from './validationLogic.js';

const validateUSerData_util = (mandatoryField, data) => {

        if (!data) {
                throw new ValidationError("No data is sent");
        }

        const errors = [];

        const missingFields = mandatoryField.filter(key => !data.hasOwnProperty(key));

        if (missingFields.length > 0) {
                errors.push(`Required fields are missing: ${missingFields.join(', ')}`);
        }

        for (const attribute in userDataValidationRule) {
                if (data.hasOwnProperty(attribute)) {

                        const { validator, errMessage } = userDataValidationRule[attribute];

                        if (!validator(data[attribute])) {
                                errors.push(errMessage);
                        }

                }
        }

        if (errors.length > 0) {
                throw new ValidationError(errors.join('; '));
        }
}

const validateUSerData = (mandatoryField) => {

        return async (req, res, next) => {

                try {
                        validateUSerData_util(mandatoryField, req.body);
                        // if data is valid give the controll to the router
                        next();

                } catch (err) {

                        res.status(400).json({
                                success: false,
                                message: err.message,
                                err: err
                        })

                }
        }
}


export { validateUSerData };