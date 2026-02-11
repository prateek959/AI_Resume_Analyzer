import User from '../models/user.model.js';
import argon from 'argon2';
import jwt from 'jsonwebtoken';

const register = async(req, res)=>{
    try {
        const {name, email, password} = req.body;
        const user = await User.findOne({email});
        // console.log(user)
        if(user){
            return res.status(400).json({msg:"You are already register"});
        }
        const hashPass = await argon.hash(password);
        await User.create({
            name,
            email,
            password:hashPass
        });
        res.status(201).json({msg:"User register successfully"});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:"Internal server error",error})
    }
};


const login = async(req, res)=>{
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({msg:"User not Exists"});
        }
        const verify = await argon.verify(user.password, password);
        if(!verify){
            return res.status(401).json({msg:"Invalid Passwor"});
        }
        const token = jwt.sign({id:user._id},process.env.SECRET_KEY,{expiresIn:'1d'});
        res.status(200).json({msg:"Login successfully",token});
    } catch (error) {
         console.log(error);
        res.status(500).json({msg:"Internal server error",error})
    }
};

export {register, login};