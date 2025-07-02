
import { setMessages } from "@/redux/Slices/chatSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetMessageRT = () => {
    const dispatch = useDispatch();
    const { socket } = useSelector(store => store.socketio);
    const { messages } = useSelector(store => store.chat);
    useEffect(() => {
        socket?.on('newMessage', (newMessage) => {
            dispatch(setMessages([...messages, newMessage]));
        })

        return () => {
            socket?.off('newMessage');
        }
    }, [messages, setMessages]);
};
export default useGetMessageRT;