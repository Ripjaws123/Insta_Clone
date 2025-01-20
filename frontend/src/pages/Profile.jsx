import useGetUserProfile from "@/hooks/useGetUserProfile";
import { POST_API } from "@/lib/helpers";
import { setUserProfile } from "@/redux/authSlice";
import { setPost } from "@/redux/postSlice";
import axios from "axios";
import { Heart, MessageCircleIcon } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("Posts");

  const { userProfile } = useSelector((store) => store.auth);
  const { user } = useSelector((store) => store.auth);

  const LoginUser = userProfile?._id === user?._id;
  const isFollowing = user?.followings?.includes(userProfile?._id);
  const displayPost =
    activeTab === "Posts" ? userProfile?.posts : userProfile?.bookmarks;

  const handleTab = (tab) => {
    setActiveTab(tab);
  };

  const likeDislike = async (postId, isLiked) => {
    console.log("The POst that is clicked", postId);
    try {
      const action = isLiked ? "dislikepost" : "likepost";
      const response = await axios.get(`${POST_API}/${postId}/${action}`, {
        withCredentials: true,
      });
      if (response.data.success) {
        const updatedPost = userProfile.posts.map((p) =>
          p._id === postId
            ? {
                ...p,
                likes: isLiked
                  ? p.likes.filter((id) => id !== user._id)
                  : [...p.likes, user._id],
              }
            : p
        );
        dispatch(setPost(updatedPost));
        dispatch(setUserProfile({ ...userProfile, posts: updatedPost }));
        toast.success(response.data.message);
      }
    } catch (error) {
      console.log("Error while LIke or Dislike", error.response);
      toast.error("Something Went Wrong", {
        description: error.response.data.message,
      });
    }
  };

  return (
    <div className="w-[77%] h-full flex flex-col items-center  px-5 py-2">
      {/* Top Part */}

      <div className=" w-full mt-1 justify-between flex">
        {/* Left Section */}
        <div className="w-[45%] h-[48vh] pt-1 relative -z-10">
          <div className="w-full h-[70%] ">
            <img
              src={
                userProfile?.coverPic ||
                `https://ui-avatars.com/api/?name=${userProfile?.username}`
              }
              alt=""
              className="w-full h-full object-cover rounded-xl aspect-auto shadow-custom-glow "
            />
          </div>
          <div className=" rounded-full absolute bottom-12 left-[70%] ring-4 ring-[#cad4dde0]">
            <img
              src={
                userProfile?.profilePic ||
                `https://ui-avatars.com/api/?name=${userProfile?.username}`
              }
              alt=""
              className="w-[120px] h-[120px] rounded-full object-fill aspect-auto shadow-custom-glow"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="w-[53%] h-[48vh] pt-2">
          {/* Top part */}
          <div className="w-full h-10 items-center justify-around flex">
            <div className=" w-48 h-8 overflow-hidden">
              <h2 className="text-2xl font-semibold text-ellipsis ">
                {userProfile?.username}
              </h2>
            </div>
            {LoginUser ? (
              <>
                <Link
                  to={"/editprofile"}
                  className="bg-[#FFF176] hover:cursor-pointer w-28 h-8 flex justify-center items-center rounded-xl"
                >
                  <span className="font-semibold">Edit Profile</span>
                </Link>
                <div className="bg-[#FFF176] hover:cursor-pointer w-28 h-8 flex justify-center items-center rounded-xl">
                  <span className="font-semibold">View Archive</span>
                </div>
                <div className="bg-[#FFF176] hover:cursor-pointer w-28 h-8 flex justify-center items-center rounded-xl">
                  <span className="font-semibold">Add tools</span>
                </div>
              </>
            ) : isFollowing ? (
              <>
                <div className="bg-[#FFF176] w-28 h-8 flex justify-center items-center rounded-lg">
                  <span className="font-semibold">Unfollow</span>
                </div>
                <div className="bg-[#FFF176] w-28 h-8 flex justify-center items-center rounded-lg">
                  <span className="font-semibold">Message</span>
                </div>
              </>
            ) : (
              <div className="bg-[#FFF176] w-28 h-8 flex justify-center items-center rounded-lg">
                <span className="font-semibold">Follow</span>
              </div>
            )}
          </div>

          {/* middle part */}
          <div className="w-full  mt-8 ml-10">
            <div className=" w-[50%] flex justify-between">
              <h4>
                <span className="font-semibold">
                  {userProfile?.posts?.length}
                </span>{" "}
                posts
              </h4>
              <h4>
                <span className="font-semibold">
                  {userProfile?.followers?.length}
                </span>{" "}
                followers
              </h4>
              <h4>
                <span className="font-semibold">
                  {userProfile?.followings?.length}
                </span>{" "}
                following
              </h4>
            </div>
            <div className="w-[80%]  flex flex-col mt-3">
              <span className="font-semibold">
                {userProfile?.bio || "No bio"}
              </span>
              <span className=" w-fit px-5 py-1 font-semibold rounded-lg hover:shadow-custom-glow hover:text-white bg-slate-400 mt-3 hover:cursor-pointer">
                @{userProfile?.username}
              </span>
            </div>
            <div className="w-[80%] flex flex-col mt-3 font-semibold">
              <span>This is the Full Stack Course</span>
              <span>This is Stack</span>
              <span>This is mern stack</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Part */}
      <div className="w-full flex flex-col justify-center items-center">
        {/* Hover Section */}
        <div className="w-[50%] h-7 flex justify-around">
          <span
            onClick={() => handleTab("Posts")}
            className={`text-lg  hover:cursor-pointer ${
              activeTab === "Posts"
                ? "font-bold border-b-4 border-blue-600"
                : ""
            } hover:border-blue-600 hover:border-b-4`}
          >
            POSTS
          </span>
          <span
            onClick={() => handleTab("Saved")}
            className={`text-lg  hover:cursor-pointer ${
              activeTab === "Saved"
                ? "font-bold border-b-4 border-blue-600"
                : ""
            } hover:border-blue-600 hover:border-b-4`}
          >
            SAVED
          </span>
          <span
            onClick={() => handleTab("Reels")}
            className={`text-lg  hover:cursor-pointer ${
              activeTab === "Reels"
                ? "font-bold border-b-4 border-blue-600"
                : ""
            } hover:border-blue-600 hover:border-b-4`}
          >
            REELS
          </span>
          <span
            onClick={() => handleTab("Tags")}
            className={`text-lg  hover:cursor-pointer ${
              activeTab === "Tags" ? "font-bold border-b-4 border-blue-600" : ""
            } hover:border-blue-600 hover:border-b-4`}
          >
            TAGS
          </span>
        </div>

        {/* Seperator */}
        <div className="w-full h-[2px] bg-slate-400"></div>

        {/* Posts */}
        <div className={`${displayPost?.length === 0 ? "hidden" : ""} w-[74%] mt-[32%] bg-[#87CEFA] grid grid-cols-4 absolute -z-10 justify-items-center gap-4 rounded-xl p-3`}>
          {displayPost?.map((postItem) => {
            const isLiked = postItem?.likes?.includes(user?._id);

            return (
              <div
                key={postItem?._id}
                className="w-[17vw] h-[60vh] shadow-custom-glow shadow-slate-900 relative group border  rounded-xl hover:cursor-pointer"
              >
                <img
                  src={postItem?.image}
                  alt=""
                  className="w-full h-full  rounded-xl aspect-auto"
                />

                <div className="w-full h-full absolute  inset-0 rounded-xl flex items-center justify-center hover:opacity-50 opacity-0 bg-black">
                  <div className=" w-full h-full flex justify-center gap-9 items-center hover:text-white">
                    <button
                      onClick={() => likeDislike(postItem?._id, isLiked)}
                      className="flex items-center gap-2 hover:text-gray-400"
                    >
                      <Heart className={`${isLiked ? "fill-white" : ""}`} />
                      <span className="text-lg">{postItem?.likes?.length}</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-gray-400">
                      <MessageCircleIcon />
                      <span>{postItem?.comments?.length}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Profile;
