import React, { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SuggestedUsers from "./SuggestedUsers";
import ListFollowing from "./ListFollowing";

const RightSidebar = () => {
  const { user } = useSelector((store) => store.auth);
  const { suggestedUsers } = useSelector((store) => store.auth);
  const suggested = "Suggested for you";
  
  return (
    <div className="w-[90%] my-10 pl-10">
      <div className="flex items-center gap-2">
        <Link to={`/profile/${user?._id}`}>
          <Avatar>
            <AvatarImage src={user?.profilePicture} alt="post_image" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>
        <div>
          <h2 className="font-semibold text-sm">
            <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
          </h2>
          <span className="text-gray-600 text-sm">
            {user?.bio || "Bio here..."}
          </span>
        </div>
      </div>
      <SuggestedUsers />
      <ListFollowing/>
    </div>
  );
};

export default RightSidebar;
