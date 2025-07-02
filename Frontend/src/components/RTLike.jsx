import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

import { Badge } from "@/components/ui/badge";
import CommentDialog from "./CommentDialog";
import { setSelectedPost } from "@/redux/Slices/postSlice";
import * as PostService from "../services/PostService";

function RTLike({ data, open, setOpen }) {
  const dispatch = useDispatch();

  const { likeNotification } = useSelector((store) => store.like);
  const [openPost, setOpenPost] = useState(false);
  const getPost = async ( idPost ) => {
    try {
        const res = await PostService.getAllPost();
    if (res) {
            const filteredPost = res.posts.find(post => post._id === idPost);
            dispatch(setSelectedPost(filteredPost))
            setOpenPost(true);
        }
    } catch (error) {
        console.log(error)
    }
  };
  return (
    <div>
      {likeNotification.length > 0 && (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <div className="cursor-pointer">
              <Badge className="rounded-full h-5 w-5 bg-red-600 h-5 w-5 absolute bottom-8 left-8 ">
                {likeNotification.length}
              </Badge>
            </div>
          </PopoverTrigger>
          <PopoverContent className="">
            <div>
              {likeNotification.length === 0 ? (
                <p>No new notification</p>
              ) : (
                likeNotification.map((notification) => {
                  return (
                    <div
                      key={notification.userId}
                      className="flex items-center gap-2 my-2 cursor-pointer mb-2 "
                      onClick={() => {
                        //
                        getPost(notification.post._id);

                      }}
                    >
                      <Avatar>
                        <AvatarImage
                          src={notification.userDetails?.profilePicture}
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <p className="text-sm">
                        <span className="font-bold ">
                          {notification.userDetails?.username}
                        </span>{" "}
                        tym your post 💟💟💟
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </PopoverContent>
        </Popover>
      )}
      <CommentDialog open={openPost} setOpen={setOpenPost} />
    </div>
  );
}

export default RTLike;
