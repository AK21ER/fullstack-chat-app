import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";//this only for formating how the date is displayed on the message

const ChatContainer = () => {
  const {messages, getMessages,isMessagesLoading, selectedUser, subscribeToMessages, 
    unsubscribeFromMessages     } = useChatStore();
  const { authUser } = useAuthStore();
  // const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);

     subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages,unsubscribeFromMessages]);// this means it will run if the selecteduserid is changed

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
   }
  }, [messages]);//here this useeffect is responisbel for checking if there is new message or not the newmessage but if the message state is changed which indicates that there is a new message as a result it will scroll it smoothly which is reffering the text part of the div by messageref

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.senderid === authUser._id ? "chat-end" : "chat-start"}`}// this will check if the sender is the user if so it will make the daisyui css to be "chatend" which displayes the text from the right side and if itsnot it will display it from left side
            ref={messageEndRef}
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderid === authUser._id
                      ? authUser.profilePic || "/avatar.png"  // this will show the profile pic of the user if the sender of the message is the uder and if not it will shows the slelected users  profiles
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            { <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div> }
            <div className="chat-bubble flex flex-col">
              {message.image && (//this means if there is an image in the message it will then show it or display it in img
                <img
                  src={message.image}              //this will display the messages in the bubble and also if thereis an image it will also 
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && //this will checck if there is a text in the message then if it gots it will then put it in the paragraph tag
              <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
};
export default ChatContainer;