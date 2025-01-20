import useGetAllMessage from "@/hooks/useGetAllMessage";
import useGetRTM from "@/hooks/useGetRTM";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const Chats = ({ selectedUser, user }) => {
  const { socket } = useSelector((store) => store.socketio);
  const { chats } = useSelector((store) => store.chat);

  useGetRTM();
  useGetAllMessage();

  if (!socket) {
    console.log("Socket is not ready. Waiting...");
    return <div>Loading chats...</div>; // Render nothing or a loading spinner
  }



  return (
    <div className="w-full h-[63vh] overflow-y-scroll rounded-b-xl mt-1">
      {/* Profile */}
      <div className="w-full flex flex-col items-center mt-2">
        <img
          src={
            selectedUser?.profilePic ||
            `https://ui-avatars.com/api/?name=${selectedUser?.username}`
          }
          className="w-20 h-20 rounded-full object-cover ring-4 ring-slate-500"
        />
        <h1 className="text-lg font-semibold">{selectedUser?.username}</h1>
        <Link
          to={`/profile/${selectedUser?._id}`}
          className="py-1 px-3 bg-slate-200 rounded-lg"
        >
          View Profile
        </Link>
      </div>

      {/* Chats */}

      {chats?.map((chat) => (
        <div
          key={chat?._id}
          className={`w-full px-4 flex gap-4 mt-2 ${
            chat?.senderId === user?._id ? "justify-end" : ""
          }`}
        >
          {/* My Chats */}

          {chat?.senderId === user?._id && (
            <>
              <div className="max-w-[52%] min-w-fit px-3 py-2 bg-zinc-500 rounded-xl flex flex-col">
                <span>{chat?.message}</span>
                <span className="text-right text-xs">8:46</span>
              </div>
              <img
                src={
                  user?.profilePic ||
                  `https://ui-avatars.com/api/?name=${user?.username}`
                }
                className="w-11 h-11 rounded-full object-cover"
              />
            </>
          )}

          {/* Friend Chats */}

          {chat?.senderId !== user?._id && (
            <>
              <img
                src={
                  selectedUser?.profilePic ||
                  `https://ui-avatars.com/api/?name=${selectedUser?.username}`
                }
                className="w-11 h-11 rounded-full object-cover"
              />
              <div className="max-w-[52%] min-w-fit px-3 py-2 bg-slate-500 rounded-xl flex flex-col">
                <span>{chat?.message}</span>
                <span className="text-right text-xs">8:46</span>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default Chats;
