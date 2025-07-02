import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import * as UserService from "../services/UserService";

import { Button } from "antd";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { toast } from "sonner";
import { setAuthUser, setUserProfile } from "@/redux/Slices/authSlice";

function EditProfileDialog({ open, setOpen }) {
  const dispatch = useDispatch();
  const imageRef = useRef();

  const { user } = useSelector((store) => store.auth.userProfile);
  useEffect(() => {
  setInput({
    username: user?.username || "",
    profilePhoto: user?.profilePicture || "",
    bio: user?.bio || "",
    gender: user?.gender || "",
  });
}, [user]);

  const [input, setInput] = useState({
    username: user?.username,
    profilePhoto: user?.profilePicture,
    bio: user?.bio,
    gender: user?.gender,
  });

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) setInput({ ...input, profilePhoto: file });
  };
  const selectChangeHandler = (value) => {
    setInput({ ...input, gender: value });
  };
  const editData = async () => {
    const formData = new FormData();
    formData.append("bio", input.bio);
    formData.append("gender", input.gender);
    formData.append("username", input.username);
    if (input.profilePhoto) {
      formData.append("profilePicture", input.profilePhoto);
    }
    try {
      const res = await UserService.updateUser(formData);
      if (res.success) {
        const updatedUserData = {
          ...user,
          username: res?.user?.username,
          bio: res?.user?.bio,
          profilePicture: res.user?.profilePicture,
          gender: res.user.gender,
        };
        dispatch(setUserProfile(updatedUserData));
        dispatch(setAuthUser(updatedUserData));

        toast.success("Update profile thành công!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Lỗi update profile");
    }
    // for (let pair of formData.entries()) {
    //   console.log(`${pair[0]}: ${pair[1]}`);
    // }
  };
  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          onInteractOutside={() => setOpen(false)}
          className=" w-[600px]"
        >
          <DialogHeader>
            <DialogTitle>Update Profile</DialogTitle>
            <DialogDescription>
              <div className="flex mt-4">
                <h2 className="text-black size-25 ">Username</h2>
                <Textarea
                  value={input.username}
                  onChange={(e) =>
                    setInput({ ...input, username: e.target.value })
                  }
                  name="bio"
                  className="focus-visible:ring-transparent h-3"
                />
              </div>

              <div className="flex">
                <h2 className="text-black size-25">Bio</h2>
                <Textarea
                  value={input.bio}
                  onChange={(e) => setInput({ ...input, bio: e.target.value })}
                  name="bio"
                  className="focus-visible:ring-transparent h-3"
                />
              </div>
              <div className="flex">
                <h2 className="text-black size-25">Gender</h2>
                <Select
                  className
                  defaultValue={input.gender}
                  onValueChange={selectChangeHandler}
                >
                  <SelectTrigger className="w-full !bg-[#00f6d1] rounded-full border border-black ">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center w-full  gap-4">
                <h2 className="text-black w-[80px]  self-center">Avatar</h2>
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage
                      src={
                        input.profilePhoto instanceof File
                          ? URL.createObjectURL(input.profilePhoto)
                          : input.profilePhoto
                      }
                      alt="post_image"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <input
                    ref={imageRef}
                    onChange={fileChangeHandler}
                    type="file"
                    className="hidden"
                  />
                  <Button
                    onClick={() => imageRef?.current.click()}
                    className="bg-[#0095F6] h-8 hover:bg-[#318bc7]"
                  >
                    Change photo
                  </Button>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={editData}
                  className="cursor-pointer w-fit text-blue-600 !bg-blue-200 hover:!bg-blue-300"
                >
                  Submit
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EditProfileDialog;
