import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  setAuthUser,
  setUserProfile,
  setSelectedUser,
} from "@/redux/Slices/authSlice";

import { MessageCircleCode } from "lucide-react";
import Messages from "../Messages.jsx";
import * as MessageService from "../../services/MessageService";
import axios from "axios";
import { setMessages } from "@/redux/Slices/chatSlice";
import { FaUserFriends } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
function ChatPage() {
  const [textMessage, setTextMessage] = useState("");
  const { user, suggestedUsers, selectedUser } = useSelector(
    (store) => store.auth
  );
  const { onlineUsers, messages } = useSelector((store) => store.chat);
  const dispatch = useDispatch();

  const followingIds = user.following;
  const friendsYouFollow = suggestedUsers?.filter((person) =>
    followingIds.includes(person._id)
  );

  const sendMessageHandler = async (IdReceiver) => {
    try {
      const res = await MessageService.sendMessage(IdReceiver, textMessage);
      if (res.success) {
        dispatch(setMessages([...messages, res.newMessage]));
        setTextMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null));
    };
  }, []);
  return (
    <div className=" ml-[8%] min-h-screen bg-white flex w-4xl">
      <section className="w-full md:w-1/4 my-8">
        <div className="flex">
          <Avatar className="w-13 h-16">
            <AvatarImage src={user?.profilePicture} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <h2 className="font-bold  text-xl">{user?.username}</h2>
            <div className="flex gap-2">
              <h2>{friendsYouFollow?.length}</h2> <FaUserFriends size={25} />
            </div>
          </div>
        </div>
        <hr className="mb-4 border-gray-300" />
        <div className="overflow-y-auto h-[80vh]">
          {friendsYouFollow.map((followUser) => {
            const isOnline = onlineUsers.includes(followUser?._id);
            return (
              <div
                onClick={() => dispatch(setSelectedUser(followUser))}
                className="flex gap-3 items-center p-3 hover:bg-gray-50 cursor-pointer"
              >
                <Avatar className="w-10 h-10">
                  <AvatarImage src={followUser?.profilePicture} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium">{followUser?.username}</span>
                  <span
                    className={`text-xs font-bold ${
                      isOnline ? "text-green-600" : "text-red-600"
                    } `}
                  >
                    {isOnline ? "online" : "offline"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      {selectedUser ? (
        <section className="flex-1 border-l border-l-gray-300 flex flex-col h-full mt-4">
          <div className="flex gap-3 items-center px-3 py-2 border-b border-gray-300 sticky top-0 bg-white z-10">
            <Avatar className="w-16 h-16">
              <AvatarImage src={selectedUser?.profilePicture} alt="profile" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span>{selectedUser?.username}</span>
            </div>
          </div>
          <Messages data={selectedUser} />
          <div className="flex items-center p-4 border-t border-t-gray-300">
            <Avatar className="w-12 h-12">
              <AvatarImage src={user?.profilePicture} alt="profile" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Input
              value={textMessage}
              onChange={(e) => setTextMessage(e.target.value)}
              type="text"
              className="flex-1 mr-2 focus-visible:ring-transparent"
              placeholder="Messages..."
            />

            <IoSend
              size={25}
              color="blue"
              className="cursor-pointer"
              onClick={() => sendMessageHandler(selectedUser?._id)}
            />
          </div>
        </section>
      ) : (
        <div className="flex flex-col items-center justify-center mx-auto">
          <MessageCircleCode className="w-32 h-32 my-4" />
          <h1 className="font-medium">Your messages</h1>
          <span>Send a message to start a chat.</span>
        </div>
      )}
    </div>
  );
}

export default ChatPage;
