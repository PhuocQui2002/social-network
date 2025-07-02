import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import * as UserService from "../../services/UserService";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { setAuthUser, setUserProfile } from "@/redux/Slices/authSlice";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { AtSign, Heart, MessageCircle } from "lucide-react";

import { Alert, Tabs } from "antd";

import { FaTag } from "react-icons/fa";
import { BsFillPostcardHeartFill } from "react-icons/bs";
import CommentDialog from "../CommentDialog";
import { setPosts, setSelectedPost } from "@/redux/Slices/postSlice";
import EditProfileDialog from "../EditProfileDialog";
function Profile() {
  const { user } = useSelector((store) => store.auth);
  const userProfile = useSelector((store) => store.auth.userProfile);
  //console.log("userProfile", userProfile);
  const [isFollowing, setIsFollowing] = useState(false);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const userFollowing = user?.following;

  const dispatch = useDispatch();
  const params = useParams();
  const userId = params.id;

  const isLoggedInUserProfile = user?._id === userProfile?.user?._id;

  const displayedPost = userProfile?.user?.posts;
  //console.log("displayedPost", displayedPost);

  const items = [
    {
      key: "1",
      label: (
        <span className="flex gap-2">
          <BsFillPostcardHeartFill style={{ fontSize: 20 }} />
          Bài viết
        </span>
      ),
      children:
        displayedPost?.length > 0 ? (
          <div className=" flex grid grid-cols-4 gap-3 justify-center">
            {displayedPost?.map((post) => {
              return (
                <div key={post?._id} className="relative group cursor-pointer">
                  <img
                    src={post.image}
                    alt="postimage"
                    className="rounded-sm my-2 w-full aspect-square object-cover "
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center text-white space-x-4">
                      <button
                        className="flex items-center gap-2 "
                        onClick={() => {
                          getComment(post);
                          setOpen(true);
                        }}
                      >
                        <Heart />
                        <span>{post?.likes.length}</span>
                      </button>
                      <button
                        className="flex items-center gap-2"
                        onClick={() => {
                          getComment(post);
                          setOpen(true);
                        }}
                      >
                        <MessageCircle />
                        <span>{post?.comments.length}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: "center", marginTop: 50, height: "110vh" }}>
            <b>Chưa có bài viết nào</b>
          </div>
        ),
    },
    {
      key: "2",
      label: (
        <span className="flex gap-2 ">
          <FaTag style={{ fontSize: 20 }} />
          Được gắn thẻ
        </span>
      ),
      children: (
        <div style={{ textAlign: "center", marginTop: 50, height: "110vh" }}>
          <b>Chưa có nội dung được gắn thẻ</b>
        </div>
      ),
    },
  ];

  const followOrUnFollowHander = async (idUser) => {
    //console.log(user?._id);
    try {
      const res = await UserService.followOrUnfollow(idUser);
      if (res.success) {
        let updatedFollowing = [];
        // kiểm tra follow chưa
        const isAlreadyFollowing = user.following.includes(idUser);

        if (isAlreadyFollowing) {
          // Nếu đã follow thì xóa ra
          updatedFollowing = user.following.filter((id) => id !== idUser);
        } else {
          // Nếu chưa follow thì thêm vào
          updatedFollowing = [...user.following, idUser];
        }

        // Cập nhật redux
        dispatch(setAuthUser({ ...user, following: updatedFollowing }));
        toast.success("Follow or Unfollow thành công!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Lỗi Unfollwing");
    }
  };
  const getComment = (post) => {
    //console.log("post", post);
    dispatch(setSelectedPost(post));
    setOpen(true);
  };

  useEffect(() => {
    // Nếu userId tồn tại trong mảng following thì set true
    const following = userFollowing.includes(userId);
    setIsFollowing(following);
  }, [userId, userFollowing]);

  useEffect(() => {
    const fetchDetailsUser = async () => {
      try {
        const res = await UserService.getDetailsUser(userId);
        if (res.success) {
          dispatch(setUserProfile(res));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchDetailsUser();
  }, [userId, setOpen, openEdit]);

  return (
    <div className=" ml-[20%] p-6 w-full min-h-screen bg-white">
      <div className=" flex flex-col gap-5 p-6 ">
        <div className="">
          <section className="ml-4">
            <div className="flex justify-center ml-20 ">
              <Avatar className="h-32 w-32">
                <AvatarImage
                  src={userProfile?.user?.profilePicture}
                  alt="profilephoto"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="mt-7 ml-2">
                <h2 className="text-2xl font-bold w-70">
                  {userProfile?.user?.username}
                </h2>
                <p>{userProfile?.user?.bio || "bio here..."}</p>
                <Badge className="w-fit" variant="secondary">
                  <AtSign />{" "}
                  <span className="pl-1">{userProfile?.user?.username}</span>{" "}
                </Badge>
              </div>
            </div>
            <div className="items-center gap-2">
              <div className="mt-5 text-center">
                <div className="mt-4 flex justify-center gap-4">
                  {isLoggedInUserProfile ? (
                    <div className="flex gap-4">
                      <Button
                        onClick={() => {
                          setOpenEdit(true);
                        }}
                      >
                        Edit Profile
                      </Button>
                      <Button>Ad tools</Button>
                    </div>
                  ) : (
                    <div className="flex gap-4">
                      {isFollowing ? (
                        <Button onClick={() => followOrUnFollowHander(userId)}>
                          Unfollow
                        </Button>
                      ) : (
                        <Button onClick={() => followOrUnFollowHander(userId)}>
                          Follow
                        </Button>
                      )}
                      <Button>Message</Button>
                    </div>
                  )}
                  <Button>View archive</Button>
                  <Button>Share</Button>
                </div>
              </div>
            </div>
          </section>
        </div>
        <div className="flex items-center gap-3 justify-center">
          <p>
            <span className="font-semibold">
              {userProfile?.user?.posts.length}{" "}
            </span>
            posts
          </p>
          <p>
            <span className="font-semibold">
              {userProfile?.user?.followers.length}{" "}
            </span>
            followers
          </p>
          <p>
            <span className="font-semibold">
              {" "}
              {userProfile?.user?.following.length}{" "}
            </span>
            following
          </p>
        </div>
        <div className="border-t border-t-gray-200 ">
          <div className="flex items-center justify-center gap-10 text-sm ">
            <Tabs
              defaultActiveKey="1"
              centered
              items={items}
              style={{
                width: "800px",
              }}
            />
          </div>
        </div>
      </div>
      <CommentDialog open={open} setOpen={setOpen} />
      <EditProfileDialog open={openEdit} setOpen={setOpenEdit} />
    </div>
  );
}

export default Profile;
