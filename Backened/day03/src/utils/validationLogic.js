
import Validator from 'validator';


export const userDataValidationRule = {
    'emailId': {
        validator: (emailId)=> Validator.isEmail(emailId),
        errMessage: "Incorrect email format"
    },
    'password': {
        validator: (password)=> Validator.isStrongPassword(password),
        errMessage: "Weak password"
    }   
}

//  these will be validator with schema constraints
    // 'age': (age)=> (age >= 5),
    // 'role': (role)=> (role == 'user' || role == 'admin'),
    // 'firstName': (firstName)=>(firstName.length > 1),
    // 'lastName': (lastName)=> (lastName.length > 1),

