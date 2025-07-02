import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { MessageCircle, MoreHorizontal, XIcon } from "lucide-react";
import { FaHeart, FaRegHeart } from "react-icons/fa";

import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import { DialogClose } from "@radix-ui/react-dialog";
import Comment from "./Comment";
import { setPosts } from "@/redux/Slices/postSlice";
import * as CommentService from "../services/CommentService";
import * as PostService from "../services/PostService";

import { toast } from "sonner";
import { Image } from "antd";

function CommentDialog({ open, setOpen, onCommentAdded }) {
  const [text, setText] = useState("");
  const [comment, setComment] = useState([]);

  const { user } = useSelector((store) => store.auth);

  const { selectedPost, posts } = useSelector((store) => store.post);
  const dispatch = useDispatch();
  //console.log("selectedPost", selectedPost);
  
  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  const sendCommentHandler = async () => {
    try {
      const res = await CommentService.createComment(selectedPost?._id, text);
      if (res.success) {
        const updatedCommentData = [...comment, res.comment];
        setComment(updatedCommentData);

        const updatedPostData = posts?.map((postComment) =>
          postComment._id === selectedPost?._id
            ? { ...postComment, comments: updatedCommentData }
            : postComment
        );

        dispatch(setPosts(updatedPostData));
        // cập nhật số lượng comment
        onCommentAdded?.(res.comment);
        toast.success(res.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
      toast.error("Lỗi comment");
    }
  };

  const [liked, setLiked] = useState(
    selectedPost?.likes.includes(user?._id) || false
  );
  // console.log ("like,",liked )
  // console.log ("setLiked,",setLiked )

  const [postLike, setPostLike] = useState(selectedPost?.likes.length);

  const likeOrDislikeHandler = async () => {
    try {
      const action = liked ? "dislike" : "like";
      const res = await PostService.likeOrDislikePost(
        action,
        selectedPost?._id
      );
      if (res.success) {
        const updatedLikes = liked ? postLike - 1 : postLike + 1;
        setPostLike(updatedLikes);
        setLiked(!liked);
        // console.log("post", posts)
        const updatedPostData = posts.map((postLike) =>
          postLike._id === selectedPost._id
            ? {
                ...postLike,
                likes: liked
                  ? postLike.likes.filter((id) => id !== selectedPost._id)
                  : [...postLike.likes, selectedPost._id],
              }
            : postLike
        );
        dispatch(setPosts(updatedPostData));

        toast.success("Like or dis like thành công");
      }
    } catch (error) {
      console.log(error);
      toast.error("lỗi like bài viết");
    }
  };

  useEffect(() => {
    if (selectedPost) {
      setComment(selectedPost.comments);
    }
  }, [selectedPost]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        showCloseIcon={false}
        className="max-w-5xl p-0 flex flex-col min-h-[400px]"
      >
        <div className="flex flex-1">
          <div className="w-1/2">
            <Image
              preview={false}
              src={selectedPost?.image}
              alt="post_img"
              className="w-full h-full object-cover rounded-l-lg mt-2"
            />
            <div className="flex items-center justify-between my-2">
              <div
                className="flex gap-2 cursor-pointer"
                onClick={() => {
                  likeOrDislikeHandler(selectedPost);
                }}
              >
                {selectedPost?.likes?.length}tym{" "}
                { liked ? (
                  <FaHeart
                    onClick={likeOrDislikeHandler}
                    size={"24"}
                    className="cursor-pointer text-red-600"
                  />
                ) : (
                  <FaRegHeart
                    onClick={likeOrDislikeHandler}
                    size={"22px"}
                    className="cursor-pointer hover:text-gray-600"
                  />
                )}
              </div>
              <div className="flex gap-2 cursor-pointer">
                {selectedPost?.comments?.length} comment <MessageCircle />
              </div>
            </div>
          </div>
          <div className="w-1/2 flex flex-col justify-between">
            <div className="flex items-center justify-between p-4">
              <div className="flex gap-3 items-center">
                <Link>
                  <Avatar>
                    <AvatarImage src={selectedPost?.author?.profilePicture} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link className="font-semibold text-xs mr-2">
                    {selectedPost?.author?.username}
                  </Link>
                  <span className="text-gray-600 text-sm">
                    {selectedPost?.caption}
                  </span>
                </div>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className="cursor-pointer" />
                </DialogTrigger>
                <DialogContent className="flex flex-col items-center text-sm text-center">
                  <div className="cursor-pointer w-full text-[#ED4956] font-bold">
                    Unfollow
                  </div>
                  <div className="cursor-pointer w-full">Add to favorites</div>
                </DialogContent>
              </Dialog>
            </div>
            <hr />
            <div className="flex-1 overflow-y-auto max-h-96 p-4">
              {comment?.map((comment) => (
                <Comment key={comment._id} comment={comment} />
              ))}
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={text}
                  onChange={changeEventHandler}
                  placeholder="Add a comment..."
                  className="w-full outline-none border text-sm border-gray-300 p-2 rounded"
                />
                <Button
                  className="cursor-pointer w-fit text-blue-600 !bg-blue-100 hover:!bg-blue-200"
                  disabled={!text.trim()}
                  onClick={sendCommentHandler}
                  variant="outline"
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CommentDialog;
