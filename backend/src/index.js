
import express from "express"; //scinse we are using type modules the way we import express is diffrent
import authRoutes from "./routes/auth.route.js"; //scinse we are using type module we have to specify the .js extenstion
import  messageroute  from "./routes/message.route.js";
import { configDotenv } from "dotenv";
import cookieParser from "cookie-parser"
import { connection_db } from "./lib/db.js";
import cors from "cors";
import { app,server } from "./lib/socket.js";


configDotenv();
const port=process.env.PORT;



app.use(express.json());//this we help me to extracte the json data from the req.body function
app.use(cookieParser());//this is mandatory when try to request and fetch data from the cookie
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}));


app.use("/api/auth",authRoutes);//every route in the auth.route file are accessed using api/auth at first
app.use("/api/messages",messageroute);

server.listen(port,()=>{
console.log(`server is running on port: ${port}`);
connection_db()
})