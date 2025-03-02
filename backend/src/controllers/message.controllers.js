import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId,io } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getuserforsidebar= async(req,res)=>{
try {
    const loggedinuserid=req.user._id;
    const filteredusers=await User.find({_id:{ $ne:loggedinuserid}}).select("-password");//this is trying to fetch allthe users exceprt my id or the user id which means the datat related to the logged in user is not fetched and the other except him will be fetched but excluding there password

    res.status(200).json(filteredusers);
} catch (error) {
    console.log("error in the getusersforsidebar process" , error.message);
    res.status(500).json({message:"internal server error"})
}
}

export const getmessages= async(req,res)=>{
    try {
        const {id:usertochatid}=req.params;//here we are trying to getthe reciver id from the paramater from the :id... adress and we assigned the one which is going to bet got next to the :id in the url as "usertochatid" inorder to access it
        const myid=req.user._id;
        const message=await Message.find({
            $or:[
                {senderid:myid , reciverid:usertochatid},
                {senderid:usertochatid,reciverid:myid}         //this we help us to fetch all the messages between the sender and the reciver on bothside
            ]
        })

        res.status(200).json(message)
    } catch (error) {
        console.log("error in the getmessage process" , error.message);
        res.status(500).json({message:"internal server error"})
    }

}
export const sendmessage=async(req,res)=>{
    try {
        const {text,image}=req.body;
        const {id:reciverid}=req.params;
        const senderid=req.user._id;

        let imageurl;
       if(image){
        //upload the image to cloudinary
        const uploadresponse=await cloudinary.uploader.upload(image);
        imageurl=uploadresponse.secure_url;
       }

       const newmessage= new Message({
        senderid,
        reciverid,
        text,
        image:imageurl,
       })
       await newmessage.save();

       // realtime functionality goes here socket.io

       const receiverSocketId=getReceiverSocketId(reciverid)
        if (receiverSocketId)//this means if the reciveruser is online beacuse at the socket oart we just make it to save it in the array this users adderress and this is possible if the user when the user is authuser which means the user became online
         {
            io.to(receiverSocketId).emit("newMessage",newmessage);//the emit function if it is used for singele it means it will broadcast it for all but we used the to function which is usefull to specify to whom to broadcast
         }
       res.status(200).json(newmessage);


    } catch (error) {
        console.log("error in the sendmessage controller" , error.message);
        res.status(500).json({message:"internal server error"})
        
    }

}