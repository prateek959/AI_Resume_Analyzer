import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
    resumeloc: { type: String, required: true },
    resumeText:{type:String,required:true},
    userID: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true }

});

const Resume = mongoose.model('resume', resumeSchema);

export default Resume;