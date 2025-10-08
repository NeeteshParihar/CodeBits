import mongoose, { Schema, model } from "mongoose";
// we will define the submission shcema when user actaully submit the problem after solving it 

const submissionSchema = new Schema({

    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    problemId: {
        type: Schema.Types.ObjectId,
        ref: 'problem',
        required: true
    },
    code: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true,
        enum: ['python', 'javascript', 'c', 'c++', 'java', 'kotlin', 'rust', 'typescript', 'go']
    },
    status: {
        type: String,
        enum: ['pending', 'accecpted', 'wrong', 'error'],
        default: 'pending'
    },
    runtime: {
        type:Number,
        default: 0
    },
    memory: {
        type: Number,
        default: 0
    },
    errorMessage: {
        type: String,
        default: ''
    },
    testCasesPassed: {
        type: Number,
        default: 0
    },
    totalTestCases: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
})

const submissionModel = model('submission', submissionSchema);

export default submissionModel;