import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import feed from "../../assets/grid.svg";
import message from "../../assets/Mail.svg";
import notification from "../../assets/bell.svg";
import logout from "../../assets/log-out.svg";
import { Bookmark, PlusSquareIcon, Search } from "lucide-react";
import { toast } from "sonner";
import { USER_API } from "@/lib/helpers";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import { useState } from "react";
import CreatePost from "../ui/CreatePost";

const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, suggestedUser, userProfile, selectedUser } = useSelector(
    (store) => store.auth
  );
  const { likenotification } = useSelector((store) => store.rtmnotification);

  const [create, setCreate] = useState(false);
  const [activeTab, setActiveTab] = useState("");

  const handleTab = (tab) => {
    setActiveTab(tab);
  };

  const handlelogout = async () => {
    try {
      const res = await axios.get(`${USER_API}/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        console.log("Logout Successfull", res.data);
        dispatch(setAuthUser(null));
        navigate("/login");
      }
    } catch (error) {
      console.log("Error While Logout", error);
      toast.error(error.response.data.message);
    }
  };
  return (
    <div className="w-[22%] mt-3 ml-1 h-[85.5vh] bg-[#87CEFA] rounded-xl shadow-custom-glow px-2 fixed">
      {/* profile */}

      <div
        style={{
          backgroundImage: `url(${
            user?.coverPic ||
            `https://ui-avatars.com/api/?name=${user?.username}`
          })`, // Replace with your fallback URL
        }}
        className="w-full h-[35%]  p-5 flex flex-col justify-center items-center relative bg-cover bg-center  mt-2 rounded-xl shadow-custom-glow"
      >
        <div className="absolute inset-0 bg-black opacity-30 rounded-xl"></div>
        {/* Image */}
        <Link
          to={`/profile/${user?._id}`}
          onClick={() => setActiveTab(null)}
          className="relative z-10 ring-2 ring-[#cad4dddd] rounded-full p-1 hover:cursor-pointer hover:shadow-custom-glow hover:shadow-[#007BFF]"
        >
          <img
            src={
              user?.profilePic ||
              `https://ui-avatars.com/api/?name=${user?.username}`
            }
            alt="Profile image"
            className="w-[66px] h-[66px] rounded-full object-fill"
          />
        </Link>

        {/* Name */}
        <Link
          to={`/profile/${user?._id}`}
          className=" text-[#333333] relative z-10 bg-[#87cefaa9] hover:bg-[#87cefa] flex flex-col justify-between items-center mt-2 px-4 py-1 rounded-xl hover:cursor-pointer "
        >
          <h2 className="font-bold text-lg">@{user?.username}</h2>
        </Link>

        {/* Details */}
        <div className="relative z-10 text-white flex w-full gap-2 items-center mt-2">
          <div className="w-1/3 flex flex-col justify-between items-center py-1 text-[#333333] bg-[#87cefaa9] rounded-2xl hover:cursor-default">
            <h2 className="font-bold ">{user?.posts.length}</h2>
            <span className="text-sm">Posts</span>
          </div>
          <div className="w-1/3 flex flex-col justify-between items-center py-1 text-[#333333] bg-[#87cefaa9] rounded-2xl hover:cursor-default">
            <h2 className="font-bold ">{user?.followers.length}</h2>
            <span className="text-sm">Followers</span>
          </div>
          <div className="w-1/3 flex flex-col justify-between items-center py-1 text-[#333333] bg-[#87cefaa9] rounded-2xl hover:cursor-default">
            <h2 className="font-bold ">{user?.followings.length}</h2>
            <span className="text-sm">Following</span>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="w-full h-[65%] pl-10 pr-20 py-2 ">
        <div className="flex flex-col justify-evenly h-full ">
          {/* Feed */}
          <Link
            to={"/"}
            onClick={() => handleTab("Feed")}
            className={`${
              activeTab === "Feed"
                ? "bg-[#FFF176] shadow-custom-glow font-bold "
                : ""
            } hover:shadow-custom-glow  hover:font-bold text-xl text-[#333333] flex  pr-10 pl-5 items-center gap-2 hover:bg-[#FFF176] hover:cursor-pointer w-full h-10 rounded-lg`}
          >
            <img src={feed} alt="feed" className={`w-6`} />
            <span>Feed</span>
          </Link>

          {/* Search */}
          <div
            onClick={() => handleTab("Search")}
            className={`${
              activeTab === "Search"
                ? "bg-[#FFF176] shadow-custom-glow font-bold "
                : ""
            } hover:shadow-custom-glow hover:font-bold text-xl text-[#333333] flex  pr-10 pl-5 items-center gap-2 hover:bg-[#FFF176] hover:cursor-pointer w-full h-10 rounded-lg`}
          >
            <Search
              className={`w-5 text-black ${
                activeTab === "Search" ? "fill-black" : ""
              }`}
            />
            <span>Search</span>
          </div>

          {/* Create */}
          <div
            onClick={() => {
              setCreate(true);
              handleTab("Create");
            }}
            className={`${
              activeTab === "Create"
                ? "bg-[#FFF176] shadow-custom-glow font-bold "
                : ""
            } hover:shadow-custom-glow shadow-[#87CEFA] hover:font-bold text-xl text-[#333333] flex  pr-10 pl-5 items-center gap-2 hover:bg-[#FFF176] hover:cursor-pointer w-full h-10 rounded-lg`}
          >
            <PlusSquareIcon className="w-5 text-black" />
            <span>Create</span>
          </div>

          {/* Bookmark */}
          <Link
            to={"/bookmarks"}
            onClick={() => handleTab("Bookmark")}
            className={`${
              activeTab === "Bookmark"
                ? "bg-[#FFF176] shadow-custom-glow font-bold "
                : ""
            } hover:shadow-custom-glow hover:font-bold text-xl text-[#333333] flex  pr-10 pl-5 items-center gap-2 hover:bg-[#FFF176] hover:cursor-pointer w-full h-10 rounded-lg`}
          >
            <Bookmark
              className={`w-5 text-black ${
                activeTab === "Bookmark" ? "fill-black" : ""
              }`}
            />
            <span>Bookmark</span>
          </Link>

          {/* Message */}
          <Link
            to={"/messages"}
            onClick={() => handleTab("Message")}
            className={`${
              activeTab === "Message"
                ? "bg-[#FFF176] shadow-custom-glow font-bold "
                : ""
            } hover:shadow-custom-glow hover:font-bold text-xl text-[#333333] flex  pr-10 pl-5 items-center gap-2 hover:bg-[#FFF176] hover:cursor-pointer w-full h-10 rounded-lg`}
          >
            <img src={message} alt="Message" className="w-6" />
            <span>Message</span>
          </Link>

          {/* Notification */}
          <Link
            to={"/notifications"}
            onClick={() => handleTab("Notification")}
            className={`${
              activeTab === "Notification"
                ? "bg-[#FFF176] shadow-custom-glow font-bold "
                : ""
            } hover:shadow-custom-glow hover:font-bold text-xl text-[#333333] relative flex pr-10 pl-5 items-center gap-2 hover:bg-[#FFF176] hover:cursor-pointer w-full h-10 rounded-lg`}
          >
            <img src={notification} alt="Notification" className={`w-6`} />
            <span>Notification</span>
            {likenotification.length > 0 && (
              <span className="w-5 h-5 flex justify-center items-center pr-[1px] pb-[2px] text-sm text-[#333333] bg-[#007BFF] rounded-full absolute top-2 right-2">
                {likenotification.length}
              </span>
            )}
          </Link>

          {/* Logout */}
          <div
            onClick={handlelogout}
            className={`hover:shadow-custom-glow hover:font-bold text-xl text-[#333333] flex  pr-10 pl-5 items-center gap-2 hover:bg-[#FFF176] hover:cursor-pointer w-full h-10 rounded-lg`}
          >
            <img src={logout} alt="Logout" className="w-6" />
            <span>Logout</span>
          </div>
        </div>
      </div>
      <CreatePost
        create={create}
        setCreate={setCreate}
        user={user}
        setActiveTab={setActiveTab}
      />
    </div>
  );
};

export default Sidebar;
