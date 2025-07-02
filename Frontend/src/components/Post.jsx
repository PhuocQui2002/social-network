import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Bookmark, MessageCircle, MoreHorizontal, Send, X } from "lucide-react";
import { Button } from "./ui/button";
import { DialogTitle } from "@radix-ui/react-dialog";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale"; // nếu bạn muốn tiếng Việt

import CommentDialog from "./CommentDialog";
import * as PostService from "../services/PostService";
import * as CommentService from "../services/CommentService";

import ListImg from "./ListImg";
import CreatePost from "./CreatePost";
import { setPosts, setSelectedPost } from "@/redux/Slices/postSlice";
import { Image } from "antd";

function Post({ post }) {
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);

  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
  const [postLike, setPostLike] = useState(post.likes.length);
  const [comment, setComment] = useState(post.comments);

  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  const commentHandler = async () => {
    try {
      const res = await CommentService.createComment(post?._id, text);
      if (res.success) {
        const updatedCommentData = [...comment, res.comment];
        setComment(updatedCommentData);

        const updatedPostData = posts.map((postComment) =>
          postComment._id === post._id
            ? { ...postComment, comments: updatedCommentData }
            : postComment
        );

        dispatch(setPosts(updatedPostData));
        dispatch(setSelectedPost(updatedPostData));

        toast.success(res.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
      toast.error("Lỗi comment");
    }
  };

  const likeOrDislikeHandler = async () => {
    try {
      const action = liked ? "dislike" : "like";
      const res = await PostService.likeOrDislikePost(action, post?._id);
      if (res.success) {
        const updatedLikes = liked ? postLike - 1 : postLike + 1;
        setPostLike(updatedLikes);
        setLiked(!liked);
        // console.log("post", posts)
        const updatedPostData = posts.map((postLike) =>
          postLike._id === post._id
            ? {
                ...postLike,
                likes: liked
                  ? postLike.likes.filter((id) => id !== user._id)
                  : [...postLike.likes, user._id],
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

  const deletePostHandler = async () => {
    try {
      const res = await PostService.deletePost(post?._id);
      if (res.success) {
        const updatedPostData = posts.filter(
          (postItem) => postItem?._id !== post?._id
        );
        dispatch(setPosts(updatedPostData));
        toast.success("Xóa thành công");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.messsage);
    }
  };

  const getComment = () => {
    dispatch(setSelectedPost(post));
    setOpen(true);
  };

  const handleNewComment = (newComment) => {

    const updatedComment = [...comment, newComment];
    setComment(updatedComment);
    const updatedPostData = posts.map((p) =>
      p._id === post._id ? { ...p, comments: updatedComment } : p
    );
    dispatch(setPosts(updatedPostData));
    
  };
  return (
    <div className="my-8 w-full max-w-[500px] mx-auto bg-white border-b border-gray-200 ">
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-2">
          <Avatar className="w-9 h-9">
            <AvatarImage src={post?.author?.profilePicture} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          <div className="items-center gap-2">
            <h2 className="font-semibold">{post?.author?.username}</h2>
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(post?.createdAt), {
                addSuffix: true,
                locale: vi,
              })}
            </span>
          </div>

          <span className=" text-xs px-2 py-[2px] rounded-full ml-2">
            {user?._id === post.author._id && (
              <Badge variant="secondary">Author</Badge>
            )}
          </span>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-sm text-center w-[570px]">
            <DialogTitle className="text-lg font-semibold">
              Post options
            </DialogTitle>

            {post?.author?._id !== user?._id && (
              <Button
                variant="ghost"
                className="cursor-pointer w-fit text-[#ED4956] font-bold !bg-red-100 hover:!bg-red-200"
              >
                Unfollow
              </Button>
            )}

            <Button
              variant="ghost"
              className="cursor-pointer w-fit text-blue-600 !bg-blue-100 hover:!bg-blue-200"
            >
              Following
            </Button>

            {user && user?._id === post?.author._id && (
              <Button
                onClick={deletePostHandler}
                variant="ghost"
                className="cursor-pointer w-fit text-[#ED4956] font-bold !bg-red-100 hover:!bg-red-200"
              >
                Delete
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <span className="font-medium mr-2">{post.caption}</span>{" "}
      <Image
        className="rounded-sm my-2 w-full aspect-square object-cover mb-1"
        src={post?.image}
        alt="post_img"
      />
      <div className="flex gap-3 items-center">
        <span className="font-medium">{postLike} tym</span>

        {comment.length > 0 && (
          <span
            onClick={getComment}
            className="cursor-pointer text-sm text-black-400"
          >
            View all {comment.length} comments
          </span>
        )}
      </div>
      {/* <ListImg images = {images}/> */}
      <div className="flex items-center justify-between my-2 ">
        <div className="flex items-center gap-3">
          {liked ? (
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
          <MessageCircle
            onClick={getComment}
            className="cursor-pointer hover:text-gray-600"
          />
          <Send className="cursor-pointer hover:text-gray-600" />
        </div>
        <Bookmark
          //onClick={bookmarkHandler}
          className="cursor-pointer hover:text-gray-600"
        />
      </div>
      <div className="flex">
        <Avatar>
          <AvatarImage src={user?.profilePicture} alt="post_image" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <p>
          <span className="font-medium mr-2 ml-3">{user?.username}</span>
        </p>
      </div>
      <div className="flex items-center justify-between w-full px-2 gap-2">
        <input
          type="text"
          placeholder="Add a comment..."
          value={text}
          onChange={changeEventHandler}
          className="outline-none text-sm w-full"
        />
        {text && (
          <span
            onClick={commentHandler}
            className="text-[#3BADF8] cursor-pointer"
          >
            Post
          </span>
        )}
      </div>
      <CommentDialog
        open={open}
        setOpen={setOpen}
        onCommentAdded={handleNewComment}
      />
    </div>
  );
}

export default Post;
