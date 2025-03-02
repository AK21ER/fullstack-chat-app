import mongoose from "mongoose";
const messageschema= new  mongoose.Schema({
    senderid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    reciverid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        
    },
    text:{
        type:String
    
    },
    image:{
        type:String
    }
},
{
    timestamps:true
}
)
const Message= mongoose.model("Message",messageschema);//here the name must be started by capital letter and it haveto be in singular form because the mongodb automaticaly create a cluster in the mongodb in plular form
export default Message
