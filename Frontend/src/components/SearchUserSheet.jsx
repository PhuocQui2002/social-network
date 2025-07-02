/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "./ui/dialog";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { MoreHorizontal, XIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import * as UserService from "../services/UserService";
import { toast } from "sonner";
import { setSearchUser } from "@/redux/Slices/authSlice";

function SearchUserSheet({ open, setOpen }) {
  const searchUser = useSelector((store) => store.auth.searchUser);
  //console.log("search", searchUser)
  const [searchValue, setSearchValue] = useState("");
  const dispatch = useDispatch();
  const fetchedOnce = useRef(false);
  const handleChange = (e) => {
    setSearchValue(e.target.value);
    //console.log(e.target.value);
  };
  useEffect(() => {
    if (!searchValue.trim()) return;

    const fetchSuggestedUsers = async () => {
      try {
        const res = await UserService.SearchUser(searchValue);
        if (res.success) {
          dispatch(setSearchUser(res));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSuggestedUsers();
  }, [searchValue]);

  useEffect(() => {
  if (!open) {
    dispatch(setSearchUser([]));
    setSearchValue("");
  }
}, [open]);

  return (
    // <div>
    //   <Dialog open={open} onOpenChange={setOpen}>
    //     <DialogContent
    //       onInteractOutside={() => setOpen(false)}
    //       className=" w-[570px] h-[80%]"
    //     >
    //       <DialogHeader className="text-center font-semibold">
    //         Tìm kiếm bạn bè
    //       </DialogHeader>
    //       <div className="text-sm text-gray-700">
    //         🔍 Nhập từ khóa tìm kiếm ở đây
    //       </div>
    //       <Input
    //         type="text"
    //         placeholder="Tìm kiếm..."
    //         className="mt-2 w-full px-3 py-2 border rounded-md text-sm outline-none focus:ring focus:ring-blue-300"
    //       />
    //       <div key={user._id} className="flex items-center justify-between">
    //         <div className="flex items-center gap-3">
    //           <Link to={`/profile/${user?._id}`}>
    //             <Avatar className="w-9 h-9">
    //               <AvatarImage
    //                 src={user?.profilePicture}
    //                 alt={user?.username}
    //               />
    //               <AvatarFallback>CN</AvatarFallback>
    //             </Avatar>
    //           </Link>
    //           <div className="text-sm">
    //             <Link
    //               to={`/profile/${user?._id}`}
    //               className="font-semibold hover:underline"
    //             >
    //               {user?.username}
    //             </Link>
    //             <div className="text-gray-500 text-xs truncate max-w-[150px]">
    //               {user?.bio || "No bio"}
    //             </div>
    //           </div>
    //         </div>
    //         <span
    //           className="text-[#3BADF8] text-xs font-bold cursor-pointer hover:text-[#3495d6]"
    //           //onClick={() => FollowingHander(user._id)}
    //         >
    //           Follow
    //         </span>
    //       </div>
    //     </DialogContent>
    //   </Dialog>
    // </div>
    <div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle> 🔍 Nhập từ khóa tìm kiếm ở đây</SheetTitle>
          </SheetHeader>
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Username"
              className="pr-10"
              onChange={handleChange}
            />
          </div>
          <>
            { searchUser?.data?.map((user) => (
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
                  //onClick={() => FollowingHander(user._id)}
                >
                  Follow
                </span>
              </div>
            ))}
          </>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default SearchUserSheet;
