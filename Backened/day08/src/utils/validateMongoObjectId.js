import mongoose from "mongoose";

export function isValidObjectId(id){
    if(!id) return false;
    return mongoose.Types.ObjectId.isValid(id);
}
