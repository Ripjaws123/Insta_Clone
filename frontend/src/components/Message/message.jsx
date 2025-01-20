import { setSelectedUser } from "@/redux/authSlice";
import {
  ForkKnifeCrossed,
  MessageCirclePlus,
  PhoneCallIcon,
  Search,
  Video,
} from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Chats from "../ui/Chats";
import share from "../../assets/paper-plane.svg";
import { toast } from "sonner";
import axios from "axios";
import { MESSAGE_API } from "@/lib/helpers";
import { setChats } from "@/redux/chatSlice";

const Message = () => {
  const [message, setMessage] = useState("");

  const { user, suggestedUser, selectedUser } = useSelector(
    (store) => store.auth
  );
  const { onlineUsers, chats } = useSelector((store) => store.chat);
  const dispatch = useDispatch();
  const isLoginOnline = onlineUsers?.includes(user?._id);
  const isChatuserOnline = onlineUsers?.includes(selectedUser?._id);

  const handleText = (e) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = async (receiverId) => {
    if (!message.trim()) {
      toast.error("Message cannot be empty");
      return;
    }

    console.log(message, receiverId);
    try {
      const response = await axios.post(
        `${MESSAGE_API}/send/${receiverId}`,
        { message },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success) {
        console.log("Message Sent", response?.data);
        dispatch(setChats([...(chats || []), response?.data?.messageResponse]));
        setMessage("");
      }
    } catch (error) {
      console.log("Error while chatting", error);
      toast.error("Something went wrong", {
        description: error?.response?.data?.message,
      });
    }
  };

  return (
    <div className="w-[75%] fixed -z-10 h-[85.5vh] px-2 py-2 my-3 rounded-xl flex items-center justify-between shadow-custom-glow bg-[#F5F5F5] ">
      {/* Left Side */}
      <div className="w-[32%] bg-[#87CEFA] rounded-xl h-full shadow-custom-light">
        {/* Message */}
        <div className="w-full flex flex-col justify-center items-center px-2 py-2 border-b-2 border-slate-300 ">
          <div className="w-full flex items-center justify-between px-3">
            <h1 className="text-2xl font-semibold">{user?.username}</h1>
            <span>{isLoginOnline ? "Online" : "Offline"}</span>
          </div>
          <div className="w-full flex rounded-full bg-slate-200 p-2 mt-2 justify-between items-center">
            <input
              type="text"
              className="w-[90%] h-6 outline-none bg-transparent pl-2 placeholder:text-gray-500 placeholder:text-lg placeholder:font-semibold"
              placeholder="Search..."
            />
            <Search />
          </div>
        </div>

        {/* Profiles */}
        <div className="w-full px-2 h-[83%] overflow-y-scroll">
          {suggestedUser.map((allUsers) => {
            // checking th user is online or not
            const isOnline = onlineUsers?.includes(allUsers?._id);
            return (
              <div
                key={allUsers?._id}
                onClick={() => dispatch(setSelectedUser(allUsers))}
                className="w-full flex hover:bg-[#FFF176] hover:cursor-pointer py-1 my-2 px-1 rounded-2xl"
              >
                <div className="w-[16%]">
                  <img
                    src={
                      allUsers?.profilePic ||
                      `https://ui-avatars.com/api/?name=${allUsers?.username}`
                    }
                    className="w-[52px] h-[52px] rounded-full"
                  />
                </div>
                <div className="w-[84%] pl-2">
                  <div className="flex justify-between">
                    <h1 className="text-lg font-semibold">
                      {allUsers?.username}
                    </h1>
                    <span className="text-sm">
                      {isOnline ? "Online" : "Offline"}
                    </span>
                  </div>
                  <p className="w-[98%] overflow-x-hidden text-sm text-ellipsis">
                    {allUsers?.bio || "Bio..."}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Side */}
      <div className="bg-[#87CEFA] rounded-xl w-[67.5%] h-full shadow-custom-dark">
        {selectedUser ? (
          <>
            <div className="w-full h-22 border-b-2 border-slate-300 px-3 py-2 flex">
              <div className="w-[11%] pl-5">
                <img
                  src={
                    selectedUser?.profilePic ||
                    `https://ui-avatars.com/api/?name=${selectedUser?.username}`
                  }
                  className="w-[55px] h-[55px] object-cover rounded-full"
                />
              </div>
              <div className="w-[84%] pl-2">
                <div className="flex justify-between">
                  <h1 className="text-lg font-semibold">
                    {selectedUser?.username}
                  </h1>
                </div>
                <p className="w-[98%] overflow-x-hidden text-sm text-ellipsis">
                  {isChatuserOnline ? "Online" : "Offline"}
                </p>
              </div>
              <div className="flex justify-center items-center gap-3 pr-3">
                <Video className="w-8 h-8 p-1 rounded-lg hover:bg-slate-300 hover:cursor-pointer" />
                <PhoneCallIcon className="w-8 h-8  p-1 rounded-lg hover:bg-slate-300 hover:cursor-pointer" />
                <ForkKnifeCrossed
                  onClick={() => dispatch(setSelectedUser(null))}
                  className="w-8 h-8  p-1 rounded-lg hover:bg-slate-300 hover:cursor-pointer"
                />
              </div>
            </div>
            <Chats selectedUser={selectedUser} user={user} />
            <div className="bg-[#87CEFA] w-full flex items-center justify-between px-2 pt-3">
              <input
                name="message"
                value={message}
                onChange={handleText}
                className=" h-10 p-2 w-full rounded-full outline-none resize-none"
                placeholder="Type a message..."
              />
              <img
                src={share}
                onClick={() => handleSendMessage(selectedUser?._id)}
                className="h-7 pl-2 hover:cursor-pointer"
              />
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col justify-center items-center">
            <MessageCirclePlus className="w-28 h-28 p-1 rounded-lg hover:bg-slate-300 hover:cursor-pointer" />
            <h1 className="text-2xl font-semibold">Select a User</h1>
            <p className="text-sm">Start a new conversation</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
