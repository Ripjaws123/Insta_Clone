import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setChats } from "@/redux/chatSlice";

const useGetRTM = () => {
  const dispatch = useDispatch();
  const { socket } = useSelector((store) => store.socketio);
  const { chats } = useSelector((store) => store.chat);

  useEffect(() => {
    // if (!socket) {
    //   console.log("Socket is not initialized yet.");
    //   return;
    // }

    // console.log("Socket is initialized. Listening for messages...");

    socket?.on("message", (newMessage) => {
      // console.log("New message received:", newMessage);       Log For Debugging
      dispatch(setChats([...(chats || []), newMessage]));
    });

    return () => {
      socket?.off("message");
    };
  }, [chats, socket, dispatch]);
};
export default useGetRTM;
