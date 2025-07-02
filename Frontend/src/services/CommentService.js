import axios from "axios";

export const axiosJWT = axios.create();

export const createComment = async (idPost, text) => {
  const res = await axios.post(
    `http://localhost:8000/api/comment/commentCreat/${idPost}`,
    { text },
    {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    }
  );
  return res.data;
};
