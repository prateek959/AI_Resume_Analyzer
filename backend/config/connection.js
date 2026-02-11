import mongoose from "mongoose";
import 'dotenv/config'

const db = async(req, res)=>{
    try {
        await mongoose.connect(process.env.MONGODB_URL_PROD);
        console.log('DB connected successfully');
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:"Internal server error",error})
    }
};


export default db;