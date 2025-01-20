import { USER_API } from "@/lib/helpers";
import { setAuthUser } from "@/redux/authSlice";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const SuggestionCard = () => {
  const dispatch = useDispatch();
  // Getting the User
  const { user } = useSelector((store) => store.auth);
  const { suggestedUser } = useSelector((store) => store.auth);

  const [istrue, setIstrue] = useState(false);
  const [isLoading, setIsLoading] = useState(null);

  // console.log(suggestedUser);

  // Follow User Function
  const FollowUnfollow = async (userId) => {
    setIsLoading(userId);
    try {
      const response = await axios.post(
        `${USER_API}/followunfollow/${userId}`,
        {},
        { withCredentials: true }
      );
      if (response.data.success) {
        console.log(
          "Successfully Followed or Unfollowed",
          response.data.user.userDetails
        );
        toast.success(response.data.message);
        dispatch(setAuthUser(response.data.user.userDetails));
      }
    } catch (error) {
      console.log("Error While Follow Unfollow", error);
      toast.error("Internal Server Error", {
        description: error.response.data.message,
      });
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <>
      {/* Top */}
      <div className=" w-full h-12  flex items-center justify-between">
        <Link
          to={`/profile/${user?._id}`}
          className="w-[20%] hover:cursor-pointer"
        >
          <img
            src={
              user?.profilePic ||
              `https://ui-avatars.com/api/?name=${user.username}`
            }
            alt="Profile"
            className="w-14 h-14 rounded-full object-cover shadow-custom-glow"
          />
        </Link>
        <div className="w-[80%] h-full flex flex-col ">
          <span className="font-semibold">{user?.username}</span>
          <span className="text-sm text-ellipsis overflow-x-hidden whitespace-nowrap">
            {user?.bio || "no bio"}
          </span>
        </div>
      </div>
      {/* suggestion for you */}
      <div className="w-full bg-[#87CEFA] rounded-xl mt-5 p-2 shadow-custom-glow">
        <div className="w-full flex justify-between items-center px-2 pb-3">
          <h1 className=" text-lg">Suggestions for you</h1>
          {suggestedUser.length > 5 && (
            <span
              onClick={() => setIstrue(!istrue)}
              className="font-semibold hover:cursor-pointer"
            >
              {istrue ? "Collapse" : "See All"}
            </span>
          )}
        </div>
        <div
          className={`w-full p-2 overflow-y-auto transition-all duration-300 ${
            istrue ? "max-h-[66vh]" : "max-h-[38vh]"
          }`}
        >
          {/* Card */}
          {suggestedUser.map((SingleUser) => (
            <div
              key={SingleUser?._id}
              className="w-full px-2 py-1 hover:bg-[#9b8c8c7a] rounded-xl  flex items-center justify-start "
            >
              <Link
                to={`/profile/${SingleUser?._id}`}
                className="w-[20%] hover:cursor-pointer"
              >
                <img
                  src={
                    SingleUser?.profilePic ||
                    `https://ui-avatars.com/api/?name=${SingleUser.username}`
                  }
                  className="w-14 h-14 rounded-full object-cover"
                />
              </Link>
              <Link
                to={`/profile/${SingleUser?._id}`}
                className="flex flex-col w-[50%] pl-3 hover:cursor-pointer"
              >
                <span className="font-semibold">{SingleUser?.username}</span>
                <span className="text-sm">@{SingleUser?.username}</span>
              </Link>
              <div className="w-[30%] mr-2">
                <button
                  onClick={() => {
                    FollowUnfollow(SingleUser?._id);
                  }}
                  disabled={isLoading === SingleUser?._id}
                  className="text-[#333333] font-semibold bg-[#FFF176] px-4 py-2 rounded-lg"
                >
                  {isLoading === SingleUser?._id ? (
                    <Loader2 className=" animate-spin w-full ml-2" />
                  ) : user?.followings?.includes(SingleUser?._id) ? (
                    "Unfollow"
                  ) : (
                    "Follow"
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SuggestionCard;
