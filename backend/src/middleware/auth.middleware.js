import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
export const protectedroute=async(req,res,next)=>{
    try {
        const token= await req.cookies.jwt; //it takes me alot of time because of not adding s in cookie hAHAHAHAH...
        if(!token){
            return res.status(401).json({message:" unauthorized-no token provided"})
        }
        const decode= jwt.verify(token,process.env.JWT_SECRET);
        if(!decode){
            return res.status(401).json({message:" unauthorized invalid token"})

        }
        const user= await User.findById(decode.userid).select("-password");//why we said .userid becausethe decode will contain the user id and another texts that are as a hash so when we say.userid we are trying to say only the user id part from the token values
        if(!user){
            return res.status(401).json({message:"user not found "})

        }
        req.user=user;
        next();
    } catch (error) {
           console.log("error in the logout process" , error.message);
        res.status(500).json({message:"internal server error"})
    }
}