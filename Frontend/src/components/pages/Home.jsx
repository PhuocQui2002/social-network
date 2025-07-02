import React, { useEffect, useRef } from "react";

import { Outlet } from "react-router-dom";
import Feed from "../Feed";
import RightSidebar from "../RightSidebar";
import LeftSidebar from "../LeftSidebar";
import Posts from "./Posts";
import { useDispatch } from "react-redux";
import { setSuggestedUsers } from "@/redux/Slices/authSlice";
import * as UserService from "../../services/UserService";

const Home = () => {
  const dispatch = useDispatch();
  const fetchedOnce = useRef(false);
  useEffect(() => {
    if (fetchedOnce.current) return; // Nếu đã fetch rồi thì thoát
    fetchedOnce.current = true;
    const fetchSuggestedUsers = async () => {
      try {
        const res = await UserService.getSuggestedUsers();
        if (res.success) {
          dispatch(setSuggestedUsers(res.users));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSuggestedUsers();
  }, [dispatch]);
  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <aside >
        <LeftSidebar />
      </aside>

      {/* Main Content: Posts */}
      <main className="w-[930px] flex-1 overflow-y-auto px-6 py-4 no-scrollbar ">
        <Posts />
      </main>

      {/* Right Sidebar */}
      <aside className="w-[300px] border-l border-gray-200">
        <RightSidebar />
      </aside>
    </div>
  );
};

export default Home;
