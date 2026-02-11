import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
resumeID:{type:mongoose.Schema.Types.ObjectId,ref:'resume',required:true},
message:{type:String,required:true},
reply:{type:String,required:true}
}, { timestamps: true})

const Message = mongoose.model('message',messageSchema);

export default Message