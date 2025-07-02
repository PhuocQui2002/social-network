import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Loader2 } from "lucide-react";
import backrout from "../../assets/BG.jpg";
import * as UserService from "../../services/UserService";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux'
const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  //const {user} = useSelector(store=>store.auth);
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
    confirmpassword: "",
  });

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true); // bật loading
    try {
      if (input.password == input.confirmpassword) {
        const res = await UserService.registerUser(input);
        if (res.success) {
          setInput({
            username: "",
            email: "",
            password: "",
            confirmpassword: "",
          });
          toast.success("Tạo tài khoản thành công!");
            navigate("/login");
        }
      } else{
        toast.error("Mật khẩu và xác nhận mật khẩu sai")
      }
    } catch (error) {
      console.error("Tạo tài khoản thất bại:", error);
      toast.error("Tạo tài khoản thất bại");
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
          <span className="font-medium">Tên tài khoản</span>
          <Input
            type="text"
            name="username"
            value={input.username}
            onChange={changeEventHandler}
            className="my-2"
          />
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
        <div>
          <span className="font-medium">Xác nhận mật khẩu</span>
          <Input
            type="password"
            name="confirmpassword"
            value={input.confirmpassword}
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
          <Button type="submit">Tạo tài khoản</Button>
        )}
      </form>
    </div>
  );
};

export default Register;
