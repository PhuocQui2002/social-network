import axios from "axios";

export const axiosJWT = axios.create();

export const getAllMessage = async (idUser) => {
  const res = await axios.get(
    `http://localhost:8000/api/message/allMessage/${idUser}`,
    {
      withCredentials: true,
    }
  );
  return res.data;
};

export const sendMessage = async ( idReceiver, message) => {
  const res = await axios.post(
    `http://localhost:8000/api/message/send/${idReceiver}`,
    { message },
    {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    }
  );
  return res.data;
};