import axios from "axios";

export const axiosJWT = axios.create();

export const registerUser = async (data) => {
  const res = await axios.post(
    `http://localhost:8000/api/user/register`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    }
  );
  return res.data;
};

export const loginUser = async (data) => {
  const res = await axios.post(`http://localhost:8000/api/user/login`, data, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
  return res.data;
};

export const logOutUser = async (data) => {
  const res = await axios.get(`http://localhost:8000/api/user/logout`, {
    withCredentials: true,
  });
  return res.data;
};

export const updateUser = async (data) => {
  const res = await axios.post(
    `http://localhost:8000/api/user/profile/edit`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    }
  );
  return res.data;
};

export const getDetailsUser = async (userId) => {
  const res = await axios.get(
    `http://localhost:8000/api/user/profile/${userId}`,
    {
      withCredentials: true,
    }
  );
  return res.data;
};

export const getSuggestedUsers = async () => {
  const res = await axios.get(
    `http://localhost:8000/api/user/getSuggestedUsers`,
    {
      withCredentials: true,
    }
  );
  return res.data;
};

export const followOrUnfollow = async (idUser) => {
  console.log(idUser);
  const res = await axios.post(
    `http://localhost:8000/api/user/followOrUnfollow/${idUser}`,
    {}, // body rỗng nếu không cần gửi gì thêm
    {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    }
  );
  return res.data;
};

export const SearchUser = async (text) => {
  console.log("text", text)
  const res = await axios.get(
    `http://localhost:8000/api/user/SearchUser?key=username&value=${text}`,
    {
      withCredentials: true,
    }
  );
  return res.data;
};
