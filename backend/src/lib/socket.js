import{Server} from "socket.io";
import http from "http";
import express from "express";
import { Socket } from "dgram";

const app=express();
const server=http.createServer(app);
const io=new Server(server,{
    cors:{
        origin: ["http://localhost:5173"]

    }
});

export function getReceiverSocketId(userId){
    return userSocketMap[userId];
}
//used to store online users
const userSocketMap={}; //{userId:socketId}

io.on("connection",(socket)=>{//here socket value is comming from the front end which will contain the base url and the query.userid
    console.log("A user connected",socket.id);

    const userId=socket.handshake.query.userId;//then here we extract the value of the socket.query.userid which will have the id of the loggined user
  
    if(userId) userSocketMap[userId]=socket.id;

    //io.emit() is used to send events to all the connected clients

    io.emit("getOnlineUsers",Object.keys(userSocketMap));

    socket.on("disconnect",()=>{
        console.log("A user disconnected",socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers",Object.keys(userSocketMap));

    })
})

export {io,app,server};