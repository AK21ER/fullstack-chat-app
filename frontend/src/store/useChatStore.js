import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInsatnce } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],//to store the all meessagess
  users: [],//to store all the users
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInsatnce.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInsatnce.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInsatnce.post(`/messages/send/${selectedUser._id}`, messageData);//this will send the data that was recieved from the handelsend message from the messageinput file and it gets the text and image from it then it will send it to the backend which is waiting for it to recive text and image from req.body
      set({ messages: [...messages, res.data] });//then the respond from the backend will be all the answer for the messagemodel so we will save it in message state and also the privious message is also stored with it
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();//here the reson why we use the get paramater is if we want to access another function inside another function we have to call it using the get parameter ot function
    if (!selectedUser) return; //this checks if there is a selelcted user or not if not itwill move out without doing any thing

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
     {/***key****/} if (newMessage.senderid!==selectedUser._id) return; //this is very essential that prevents it from making the text to be send to unwanted user meknyatum yhehe kelele online kefto yemitebek sew hula yemigebaw text yemayet mebt yenorewal yehe demo letflgew sew endayders yadergewal
     /* const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;*/ //this is the same as the above line code does

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));