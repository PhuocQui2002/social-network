import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import * as UserService from "../services/UserService";
import { toast } from "sonner";
import { setAuthUser } from "@/redux/Slices/authSlice";
const SuggestedUsers = () => {
  const { user } = useSelector((store) => store.auth);
  const { suggestedUsers } = useSelector((store) => store.auth);

  const dispatch = useDispatch();
  const followingIds = user?.following;

  //console.log("suggestedUsers:", suggestedUsers);
  const friendsSuggested = suggestedUsers?.filter(
    (person) => !followingIds?.includes(person._id)
  );
  const FollowingHander = async (idUser) => {
    //console.log(user?._id);
    try {
      const res = await UserService.followOrUnfollow(idUser);
      if (res.success) {
        // cập nhật follow
        const updatedFollowing = [...user.following, idUser];
        dispatch(setAuthUser({ ...user, following: updatedFollowing }));
      }
    } catch (error) {
      console.log(error);
      toast.error("Lỗi Unfollwing");
    }
  };
  return (
    <div className="my-6">
      <div className="flex items-center justify-between text-sm mb-2">
        <h2 className="font-semibold text-gray-600">Suggested for you</h2>
        <span className="font-medium cursor-pointer text-blue-500 hover:underline">
          See All
        </span>
      </div>

      {/* Box cuộn cố định chiều cao */}
      <div className="max-h-[280px] overflow-y-auto pr-2 space-y-4 no-scrollbar">
        {friendsSuggested?.length > 0 ? (
          friendsSuggested?.map((user) => (
            <div key={user._id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link to={`/profile/${user?._id}`}>
                  <Avatar className="w-9 h-9">
                    <AvatarImage
                      src={user?.profilePicture}
                      alt={user?.username}
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div className="text-sm">
                  <Link
                    to={`/profile/${user?._id}`}
                    className="font-semibold hover:underline"
                  >
                    {user?.username}
                  </Link>
                  <div className="text-gray-500 text-xs truncate max-w-[150px]">
                    {user?.bio || "No bio"}
                  </div>
                </div>
              </div>
              <span
                className="text-[#3BADF8] text-xs font-bold cursor-pointer hover:text-[#3495d6]"
                onClick={() => FollowingHander(user._id)}
              >
                Follow
              </span>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm">No suggestions</p>
        )}
      </div>
    </div>
  );
};

export default SuggestedUsers;
