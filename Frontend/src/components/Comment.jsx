import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { FaHeart, FaReply } from "react-icons/fa";

const Comment = ({ comment }) => {
  return (
    <div className="my-2 border-b border-gray-200 pb-2">
      <div className="flex gap-3 items-start">
        <Avatar>
          <AvatarImage src={comment?.author?.profilePicture} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <h2 className="font-bold text-sm">
            {comment?.author?.username}{" "}
            <span className="font-normal pl-1">{comment?.text}</span>
          </h2>
          <div className="flex gap-4 mt-1 text-sm text-gray-600">
            <FaHeart size={14} className="cursor-pointer text-red-600" />
            <FaReply size={14} className="cursor-pointer text-blue-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comment;
