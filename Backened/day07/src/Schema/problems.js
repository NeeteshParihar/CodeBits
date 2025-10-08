import { Schema, model } from "mongoose";
// we will be creating the problem schema 

const problemSchema = new Schema({

    title: {
        type: String,
        required: true,
        unique: true,
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
    visibleTestCases:{
        type:  [
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
    required: true,
    },

    hiddenTestCases:{
        type:  [
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
    required: true
    },
    startCode:{
        type: [
        {
            language:{
                type: String,
                required: true,
            },
            code: {
                type: String,
                required: true
            }
        }
    ],
    required: true
    },
    refrenceSolution:{
        type: [
        {
            language: {
                type: String,
                required: true
            },
            code: {
                type: String,
                required: true
            }
        }
    ],
     required: true
    },
    problemCreator: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    }

}, {
    timestamps: true
});

const problemModel = model('problem', problemSchema);
export default problemModel;

