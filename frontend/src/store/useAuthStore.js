import {create} from "zustand";
import { axiosInsatnce } from "../lib/axios.js";
import axios from "axios";
import  toast from "react-hot-toast";
import { io } from "socket.io-client"


const BASE_URL="http://localhost:5001";

export const useAuthStore=create((set,get)=>({
authUser:null,
isSigningUp:false,
isLoggingIng:false,
isUpdateProfile:false,
onlineUsers:[],
socket:null,

isCheckingAuth:true,

//here it takes the datat that is respondend from the check function from the backend which is the information of the user  and put it in the useauth which has a null value initialy and ones it has stored the value checkingauth willl be false wich was initially true 
   checkAuth: async () => {
    try {
      const res = await axiosInsatnce.get("/auth/check");

      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInsatnce.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
      get().connectSocket();//after the account is creaated sucessfully we will make it on the socket
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
     
    }
  },
login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInsatnce.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");

     get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },
logout: async()=>{
    try {
        await axiosInsatnce.post("/auth/logout");
        set({authUser:null});
        toast.success("logout successfully");
        get().disconnectSocket();
        
    } catch (error) {
        toast.error(error.response.data.message);
    }
},

updateProfile: async (data) => {
  set({ isUpdatingProfile: true });
  try {
    const res = await axiosInsatnce.put("/auth/update-profile", data);
    set({ authUser: res.data });
    toast.success("Profile updated successfully");
  } catch (error) {
    console.log("error in update profile:", error);
    toast.error(error.response.data.message);
  } finally {
    set({ isUpdatingProfile: false });
  }
},
connectSocket:()=>{
  const {authUser}=get();
  if(!authUser|| get().socket?.connected()) return;


const socket=io(BASE_URL,{
  query:{
    userId: authUser._id,
  }
});//which means we just give for the backend the backend adrress we want to access
socket.connect();



//here it is responsible for the greenlight online indicater and the online offline word indicater
socket.on("getOnlineUsers",(userIds)=>{
  set({onlineUsers:userIds});//so if it gots a userids then it will put them in the onlineuser state which then if the online user have a value then the online indicater lite also will be on and also the online showing will be shown
})

set({socket:socket});
},


disconnectSocket:()=>{
if (get().socket?.connected)get().socket.disconnect();
},
}))