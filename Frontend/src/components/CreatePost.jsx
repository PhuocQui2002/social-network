import React, { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { readFileAsDataURL } from "@/lib/utils";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Label } from "@radix-ui/react-label";
import * as PostService from "../services/PostService";
import { toast } from "sonner";
import { setPosts } from "@/redux/Slices/postSlice";

function CreatePost({ open, setOpen }) {
  const dispatch = useDispatch();

  const imageRef = useRef();
  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const {posts} = useSelector(store=>store.post);

  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const dataUrl = await readFileAsDataURL(file);
      setImagePreview(dataUrl);
    }
  };
  const createPostHandler = async (e) => {
    const formData = new FormData();
    formData.append("caption", caption);
    if (imagePreview) formData.append("image", file);
    try {
      const res = await PostService.createPost(formData);
      if (res.success) {
        dispatch(setPosts([res.post, ...posts]));// [1] -> [1,2] -> total element = 2
        toast.success(res.message);
        setOpen(false);
      }
    } catch (error) {
      toast.error(error);
    }
  };
  useEffect(() => {
    // const res = PostService.getAllPost();
    // dispatch(setPosts(res))
    if (!open) {
      setFile("");
      setCaption("");
      setImagePreview("");
    }
  }, [open]);

  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className=" w-[570px]"
      >
        <DialogHeader className="text-center font-semibold">
          Create New Post
        </DialogHeader>
        <div className="flex gap-3 items-center">
          <Avatar className="w-20 h-20">
            <AvatarImage src={user?.profilePicture} alt="img" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 leading-tight">
              {user?.username}
            </h2>
            <span className="text-gray-600 text-xs">{user?.bio}</span>
          </div>
        </div>
        <div className="grid w-full gap-3">
          <Label htmlFor="message">Post content</Label>
          <Textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write a caption..."
            id="message"
          />
        </div>

        {imagePreview && (
          <div className="w-full h-64 flex items-center justify-center">
            <img
              src={imagePreview}
              alt="preview_img"
              className="object-cover h-full w-full rounded-md"
            />
          </div>
        )}
        <input
          ref={imageRef}
          type="file"
          className="hidden"
          onChange={fileChangeHandler}
        />
        <Button
          onClick={() => imageRef.current.click()}
          className="w-fit mx-auto !bg-[#0095F6] hover:!bg-[#258bcf] "
        >
          Select from computer
        </Button>
        {imagePreview &&
          (loading ? (
            <Button className="w-fit mx-auto !bg-[#0095F6] hover:!bg-[#25cf83] ">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button 
              onClick={createPostHandler}
              type="submit"
              className="w-full  hover:!bg-[#25cf83] "
            >
              Post
            </Button>
          ))}
      </DialogContent>
    </Dialog>
  );
}

export default CreatePost;
