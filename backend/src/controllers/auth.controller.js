import { generateToken } from "../lib/util.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
import cloudinary from "../lib/cloudinary.js";
export const signup = async(req,res)=>{
    const{fullname,email,password}=req.body;
    try {
        if(!fullname||!email||!password){
            return res.status(400).json({message:"missing ceredential"});

        }

        if (password.length<6){
            return res.status(400).json({message:"password must be at least 6 character"});
        }


        const user=await User.findOne({email})//here the reson bhind why email is writen as {email} is because the findone () is expecting the object so {email} is means {email:email} its short hand notation
        if(user) return res.status(400).json({message:"email already exists!!"});
        
        
        const salt= await bcrypt.genSalt(10);
        const hashedpassword=  await bcrypt.hash(password,salt);
        
        
        const newuser= new User({
            fullname,
            email,
            password:hashedpassword
        })
        if (newuser){
              await newuser.save();
              generateToken(newuser._id,res);
     

           res.status(201).json({
            _id:newuser._id,
            fullname:newuser.fullname,
            email:newuser.email,
            profilepic:newuser.profilepic,
           })


        }else {
            return res.status(400).json({message:"invalid user info"});

        }

    } catch (error) {
        console.log("error in the signup process" , error.message);
        res.status(500).json({message:"internal server error"});
    }
};
export const login =async(req,res)=>{ 
    const{email,password}=req.body;

    try {
        const user= await User.findOne({email});
        if(!user){
            return res.status(404).json({message:"invalied credntials"})
        }
        const ispass= await bcrypt.compare(password,user.password);
        if(!ispass){
            return res.status(404).json({message:"invalied credntial password"})

        }
        generateToken(user._id,res);
        res.status(201).json({
            _id:user._id,
            fullname:user.fullname,
            email:user.email,
            profilepic:user.profilepic,
           })

    } catch (error) {
        console.log("error in the login process" , error.message);
        res.status(500).json({message:"internal server error"});
    
    }
};
export const logout =(req,res)=>{
    try {
        res.cookie("jwt","",{ maxAge:0 });
        res.status(200).json({message:"log out successfully"});
    } catch (error) {
        console.log("error in the logout process" , error.message);
        res.status(500).json({message:"internal server error"});
    }
};



export const updateprofile=async(req,res)=>{
    try {
        const{profilepic}=req.body;
        const userid=req.user._id;//this is taken from the protected route scince we asigned req.user=user so we can access the user by req.user in this function
        if(!profilepic){
            return res.status(401).json({message:"profile pis is required"})

        }
        const uploadresponse= await cloudinary.uploader.upload(profilepic)//this is just like a bucket wich is used to store the image it is not a database it just like a bucket
        const updateuser=await User.findByIdAndUpdate(userid,{profilepic:uploadresponse.secure_url},{new:true})//so this will give us the http url adress of the stored image and asign it to the proflr pic object and the new true part is used to show the latest update of the uploded image

        res.status(200).json({message:"updated profile picture"})
        
    } catch (error) {
        console.log("error in the update profile process" , error.message);
        res.status(500).json({message:"internal server error"});
        
    }

};
export const checkauth=async(req,res)=>{
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("error in the checkauth process" , error.message);
        res.status(500).json({message:"internal server error"});
    }
};