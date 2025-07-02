import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Post from "../Post";
import * as PostService from "../../services/PostService";
import { toast } from "sonner";
import { setPosts } from "@/redux/Slices/postSlice";

const Posts = () => {
  const [ramdomPost, setRamdomPosts] = useState([]);
  const dispatch = useDispatch();
  const hasFetched = useRef(false); // flag chặn gọi lại

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const getPost = async () => {
      try {
        const res = await PostService.getAllPost();
        //console.log(res);
        if (res.success) {
          dispatch(setPosts(res.posts));
          const data = [...res.posts];
          data.sort(() => Math.random() - 0.5);
          setRamdomPosts(data);
        }
      } catch (error) {
        toast.error("Lỗi khi lấy bài viết");
        console.error(error);
      }
    };

    getPost();
  }, [dispatch]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const posts = useSelector((store) => store.post.posts) || [];

  return (
    <div>
      {ramdomPost?.map((post) => (
        <Post key={post._id} post={post} />
      ))}
    </div>
  );
};

export default Posts;
