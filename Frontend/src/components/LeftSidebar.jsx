import React, { useState } from "react";
import {
  Bell,
  Home,
  LogOut,
  MessageCircleMore,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import NamImage from "../assets/Nam1.jpg";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import * as UserService from "../services/UserService";
import { useDispatch, useSelector } from "react-redux";
import {
  setAuthUser,
  setSelectedUser,
  setUserProfile,
} from "@/redux/Slices/authSlice";
import CreatePost from "./CreatePost";
import { resetPost, setPosts, setSelectedPost } from "@/redux/Slices/postSlice";

import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

import SearchUser from "./SearchUserSheet";
import { setLikeNotification } from "@/redux/Slices/likeSlice";
import RTLike from "./RTLike";

function LeftSidebar() {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const { likeNotification } = useSelector((store) => store.like);
  const dispath = useDispatch();

  const [open, setOpen] = useState(false);
  const [openPopover, setOpenPopover] = useState(false);

  const [openSearch, setOpenSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleChange = (e) => {
    setSearchValue(e.target.value);
    //console.log(e.target.value);
  };

  const sidebarItems = [
    { icon: <Home color="blue" />, text: "Home" },
    {
      icon: <Search color="blue" />,
      text: "Search",
    },
    { icon: <Bell color="red" />, text: "Notifications" },
    // <Sheet>
    //   <SheetTrigger asChild>
    //     <div className="flex gap-3">
    //       <Search variant="outline" /> <span> Search</span>
    //     </div>
    //   </SheetTrigger>
    //   <SheetContent>
    //     <SheetHeader>
    //       <SheetTitle> 🔍 Nhập từ khóa tìm kiếm ở đây</SheetTitle>
    //     </SheetHeader>
    //     <div className="relative">
    //       <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
    //       <Input
    //         type="text"
    //         placeholder="Username"
    //         className="pr-10"
    //         onChange={handleChange}
    //       />
    //     </div>
    //   </SheetContent>
    // </Sheet>
    // ),
    // text: "",
    // },
    { icon: <TrendingUp />, text: "Explore" },
    { icon: <MessageCircleMore />, text: "Messages" },
    
    { icon: <PlusSquare />, text: "Create" },

    {
      icon: (
        <Avatar className="w-6 h-6">
          <AvatarImage src={user?.profilePicture} alt="@shadcn" />
          <AvatarFallback></AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    { icon: <LogOut color="red" />, text: "Logout" },
  ];

  const logoutHandler = async () => {
    try {
      const res = await UserService.logOutUser();
      //console.log(res);
      if (res.success) {
        dispath(setPosts(null));
        dispath(setAuthUser(null));
        dispath(setSelectedPost(null));
        dispath(setUserProfile([]));
        dispath(setSelectedUser(null));
        toast.success(res.message);
        navigate("/login");
      }
    } catch (error) {
      toast.error("Lỗi đăng xuất");
    }
  };
  const sidebarHandler = (textType) => {
    if (textType === "Logout") {
      logoutHandler();
    } else if (textType === "Create") {
      setOpen(true);
    } else if (textType === "Profile") {
      navigate(`/profile/${user?._id}`);
    } else if (textType === "Home") {
      navigate("/");
    } else if (textType === "Messages") {
      navigate("/chatPage");
    } else if (textType === "Search") {
      setOpenSearch(true);
    } else if (textType === "Notifications") {
      setOpenPopover(true);
    }
  };
  return (
    <div className="fixed top-0 left-0 h-screen w-[16%] border-r border-gray-300 px-4 z-10">
      <div className="flex flex-col">
        <h1 className="my-8 pl-3 font-bold text-xl">LOGO</h1>
        <div>
          {sidebarItems.map((item, index) => {
            return (
              <div
                key={index}
                className="flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3"
                onClick={() => sidebarHandler(item.text)}
              >
                {item.icon}
                <span>{item.text}</span>
                {item.text === "Notifications" && (
                  <RTLike
                    open={openPopover}
                    setOpen={setOpenPopover}
                    data={item}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
      <CreatePost open={open} setOpen={setOpen} />
      <SearchUser open={openSearch} setOpen={setOpenSearch} />
    </div>
  );
}

export default LeftSidebar;
