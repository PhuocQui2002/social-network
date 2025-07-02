import axios from "axios";

export const axiosJWT = axios.create();

export const createPost = async (data) => {
  const res = await axios.post(
    `http://localhost:8000/api/post/createPost`,
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

export const getAllPost = async () => {
  const res = await axios.get(
    `http://localhost:8000/api/post/getAllPost`,
    {
      withCredentials: true,
    }
  );
  return res.data;
};

export const deletePost = async (idPost) => {
  const res = await axios.delete(
    `http://localhost:8000/api/post/deletePost/${idPost}`,
    {
      withCredentials: true,
    }
  );
  return res.data;
};

export const likeOrDislikePost = async (action, idPost) => {
  const res = await axios.get(
    `http://localhost:8000/api/post/${action}/${idPost}`,
    {
      withCredentials: true,
    }
  );
  return res.data;
};
