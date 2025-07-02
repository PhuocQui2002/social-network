import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Loader2 } from "lucide-react";
import backrout from "../../assets/BG.jpg";
import * as UserService from "../../services/UserService";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAuthUser } from "@/redux/Slices/authSlice";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true); // bật loading
    try {
      const res = await UserService.loginUser(input);
      if (res.success) {
      dispatch(setAuthUser(res.user));
        setInput({
          email: "",
          password: "",
        });
        toast.success("Đăng nhập thành công!");
         navigate("/");
      }
    } catch (error) {
      console.error("Đăng nhập thất bại:", error);
      toast.error("Tài khoản hoặc mật khẩu sai");
    } finally {
      setLoading(false); // tắt loading
    }
  };

  return (
    <div
      className="flex items-center w-screen h-screen justify-center"
      //style={{ backgroundImage: `url(${backrout})` }}
    >
      <form
        onSubmit={submitHandler}
        action=""
        className="w-[430px] shadow-lg flex flex-col gap-5 p-8"
      >
        <div className="my-4">
          <h1 className="text-center font-bold text-black-600 mag">Logo</h1>
          <p className="text-sm text-center">Đăng nhập để khám phá</p>
        </div>
        <div>
          <span className="font-medium">Tài khoản</span>
          <Input
            type="email"
            name="email"
            value={input.email}
            onChange={changeEventHandler}
            className="my-2"
          />
        </div>
        <div>
          <span className="font-medium">Mật khẩu</span>
          <Input
            type="password"
            name="password"
            value={input.password}
            onChange={changeEventHandler}
            className="focus-visible:ring-transparent my-2"
          />
        </div>
        {loading ? (
          <Button>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </Button>
        ) : (
          <Button type="submit">Đăng nhập</Button>
        )}

        <span className="flex justify-center hover:text-pink-700">
          Bạn chưa có tài khoản?{" "}
          <Link to="/register" className="" style={{ color: "black" }}>
            {" "}
            Đăng ký
          </Link>
        </span>
      </form>
    </div>
  );
};

export default Login;
