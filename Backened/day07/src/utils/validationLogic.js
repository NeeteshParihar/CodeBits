
import Validator from 'validator';

export const userDataValidationRule = {
    'emailId': {
        validator: (emailId) => Validator.isEmail(emailId),
        errMessage: "Incorrect email format"
    },
    'password': {
        validator: (password) => Validator.isStrongPassword(password),
        errMessage: "Weak password"
    }
}

//  these will be validator with schema constraints
// 'age': (age)=> (age >= 5),
// 'role': (role)=> (role == 'user' || role == 'admin'),
// 'firstName': (firstName)=>(firstName.length > 1),
// 'lastName': (lastName)=> (lastName.length > 1),



const difficultyLevels = ['easy', 'medium', 'hard'];
const allowedTags = [
  'Array', 'String', 'BinarySearch', 'Recursion', 'Backtracking',
  'LinkedList', 'Tree', 'BinaryTree', 'BinarySearchTree', 'Graph', 'DynamicProgramming'
];

export const problemDataValidationRule = {
  title: {
    validator: (title) => typeof title === 'string' && title.length > 5,
    errMessage: "Incorrect title format"
  },
  description: {
    validator: (description) => typeof description === 'string' && description.length > 20,
    errMessage: "Short description for a problem is not acceptable less than 20 length"
  },
  difficultyLevel: {
    validator: (level) => typeof level === 'string' && difficultyLevels.includes(level),
    errMessage: `difficultyLevel should be one of: ${difficultyLevels.join(', ')}`
  },
  tags: {
    validator: (tag) => typeof tag === 'string' && allowedTags.includes(tag),
    errMessage: `Tag should be one of: ${allowedTags.join(', ')}`
  },
  visibleTestCases: {
    validator: (cases) =>
      Array.isArray(cases) &&
      cases.every(tc =>
        typeof tc.input === 'string' &&
        typeof tc.output === 'string' &&
        typeof tc.explanation === 'string'
      ),
    errMessage: "Each visible test case must have input, output, and explanation as strings"
  },
  hiddenTestCases: {
    validator: (cases) =>
      Array.isArray(cases) &&
      cases.every(tc =>
        typeof tc.input === 'string' &&
        typeof tc.output === 'string'
      ),
    errMessage: "Each hidden test case must have input and output as strings"
  },
  startCode: {
    validator: (codeArr) =>
      Array.isArray(codeArr) &&
      codeArr.every(code =>
        typeof code.language === 'string' &&
        typeof code.code === 'string'
      ),
    errMessage: "Each startCode entry must have a language and code string"
  },
  refrenceSolution: {
    validator: (solArr) =>
      Array.isArray(solArr) &&
      solArr.every(sol =>
        typeof sol.language === 'string' &&
        typeof sol.code === 'string'
      ),
    errMessage: "Each referenceSolution entry must have a language and code string"
  }
};

