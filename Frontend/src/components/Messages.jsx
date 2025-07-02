import React, { useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as MessageService from "../services/MessageService";
import { setMessages } from "@/redux/Slices/chatSlice";
import useGetMessageRT from "@/hooks/useGetMessageRT";
function Messages({ data }) {
  const { selectedUser } = useSelector((store) => store.auth);
  useGetMessageRT();
  useEffect(() => {
    const fetchAllMessage = async () => {
      try {
        const res = await MessageService.getAllMessage(selectedUser?._id);
        if (res.success) {
          dispatch(setMessages(res.messages));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllMessage();
  }, [selectedUser]);

  //console.log("data-messs", data)
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const {messages} = useSelector(store=>store.chat);
  
  const messagesEndRef = useRef(null);
  useEffect(() => {
  if (messagesEndRef.current) {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }
}, [messages]); // ✅ Gọi lại mỗi khi messages thay đổi

  return (
    <div className="overflow-y-auto flex-1 p-4 max-h-[600px] min-h-[600px] no-scrollbar">
      <div className="flex justify-center">
        <div className="flex flex-col items-center justify-center">
          <Avatar className="h-20 w-20">
            <AvatarImage src={data?.profilePicture} alt="profile" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span>{data?.username}</span>
          <Link to={`/profile/${data?._id}`}>
            <Button
              className="h-8 my-2 !bg-[#00e2f6] hover:!bg-[#259fcf]"
              variant="secondary"
            >
              View profile
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        { messages &&
          messages.map((msg) => {
            return (
              <div
                key={msg._id}
                className={`flex ${
                  msg.senderId === user?._id ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`p-2 rounded-lg max-w-xs break-words ${
                    msg.senderId === user?._id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            );
          })}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

export default Messages;
