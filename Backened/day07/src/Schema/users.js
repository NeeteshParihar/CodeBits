import { Schema, model } from "mongoose";

const userSchema = new Schema({

    firstName: {
        type: String,
        minLength: 1,
        maxLength: 20,
        required: true
    },
    lastName: {
        type: String,
        minLength: 1,
        maxLength: 20,
    },
    password: {
        type: String,
        minLength: 8,
        required: true
    },
    emailId: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        immutable: true,
        required: true
    },
    age: {
        type: Number,
        min: 5,
        max:80
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',       
    },
    problemSolved: {
        type: [String]
    }
}, {
    timestamps: true
});

const userModel = model('user', userSchema);

export default userModel;
