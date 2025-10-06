import { Schema, model } from "mongoose";

// we will be creating the problem schema 

const problemSchema = new Schema({

    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    difficultyLevel: {
        type: String,
        required: true,
        enum: ['easy', 'medium', 'hard']
    },
    tags: {
        type: String,
        required: true,
        enum: ['Array', 'String', 'BinarySearch', 'Recursion', 'Backtracking', 'LinkedList', 'Tree', 'BinaryTree', 'BinarySearchTree', 'Graph', 'DynamicProgramming',]
    },
    visibleTestCases: [
        {
            input:{
                type: String,
                required: true,                
            },
            output: {
                type: String,
                required: true
            },
            explanation: {
                type: String,
                required: true
            }

        }
    ],
    hiddenTestCases: [
        {
            input:{
                type: String,
                required: true,                
            },
            output: {
                type: String,
                required: true
            },          
        }
    ],
    startCode:[
        {
            language:{
                type: String,
                required: true,
            },
            initialCode: {
                type: String,
                required: true
            }
        }
    ],
    problemCreator: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    }

});

const problemModel = model('problem', problemSchema);

export default problemModel;