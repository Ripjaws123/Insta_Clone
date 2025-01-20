import { POST_API } from "@/lib/helpers";
import { setAuthUser } from "@/redux/authSlice";
import { setPost } from "@/redux/postSlice";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

// eslint-disable-next-line react/prop-types
const EditPop = ({ isclicked, setIsclicked, postOne }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const { post } = useSelector((store) => store.post);
  const [isOpen, setIsOpen] = useState(false);

  const LoggedInUser = user?._id;
  const PostId = postOne?._id;
  const PostAuthorId = postOne?.author._id;
  const isAuthor = LoggedInUser === PostAuthorId;
  // const postLike = postOne?.likes?.length;

  // Console Logs
  // console.log("This is the post", postOne);
  // console.log("This Post like is", postLike);
  // console.log("This is the post", post);
  // console.log(PostId);

  // Transition effect
  useEffect(() => {
    if (isclicked) {
      setIsOpen(true);
    }
  }, [isclicked]);

  // Close with transition
  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setIsclicked(false);
    }, 60); // Match transition duration
  };

  // Api for Deletion
  const handleDelete = async () => {
    try {
      const response = await axios.delete(`${POST_API}/${PostId}/deletepost`, {
        withCredentials: true,
      });
      if (response.data.success) {
        console.log("Deleting post Complete", response.data);
        toast.success("Deletion Successful", {
          description: response.data.message,
        });

        // Updating the Redux post state
        const updatedPosts = post.filter(
          (postEach) => postEach?._id !== PostId
        );
        dispatch(setPost(updatedPosts));
        dispatch(setAuthUser(response.data.user));
        setIsclicked(false);
      }
    } catch (error) {
      console.log("Error in Deleting ", error.response);
      toast.error("Deletion Unsuccessful", {
        description: error.response.data.message,
      });
    }
  };

  // Api for Bookmark
  const bookmarkPost = async (PostId) =>{
    try {
      const response = await axios.get(`${POST_API}/${PostId}/bookmarkpost`, {
        withCredentials: true,
      })
      if(response.data.success){
        console.log("Successfully Bookmarked or Unbookmarked", response.data);
        toast.success(response.data.message)
        dispatch(setAuthUser(response.data.user));
      }
    } catch (error) {
      console.log("Error while BookMark", error);
      toast.error("Something Went Wrong", {
        description: error.response.data.message,
      });
    }
  }

  // checking the Is clicked
  if (!isclicked) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full  bg-black bg-opacity-50 backdrop-blur-[2px] flex items-center justify-center z-50">
      <button
        onClick={handleClose}
        className="w-10 h-10 hover:bg-slate-800 bg-slate-600 shadow-custom-glow shadow-slate-800 hover:text-white rounded-xl absolute top-[29%] right-[33%]"
      >
        X
      </button>
      <div
        className={` transition-transform duration-200 ${
          isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0"
        } ${
          user && isAuthor ? "h-[20%]" : "h-[20%]"
        } w-[20%] bg-white shadow-custom-glow shadow-slate-800 px-4 pt-2 pb-4 rounded-2xl`}
      >
        <div className="w-full h-full flex flex-col justify-evenly mt-2">
          {postOne?.author?._id !== user?._id && (
            <button className="text-lg text-white font-semibold w-full h-10 shadow-custom-glow bg-red-500 hover:text-black hover:bg-[#b0b8bf] hover:border-[3px] hover:border-black rounded-xl">
              Unfollow
            </button>
          )}
          <button onClick={()=> bookmarkPost(postOne?._id)} className="text-lg text-white font-semibold w-full h-10 shadow-custom-glow bg-green-600 hover:text-black hover:bg-[#b0b8bf] hover:border-[3px] hover:border-black rounded-xl">
            {user?.bookmarks?.includes(postOne?._id) ? 'Remove from Favourites' : 'Add to Favourites'}
          </button>
          {user && isAuthor && (
            <button
              onClick={handleDelete}
              className="text-lg text-white font-semibold w-full h-10 shadow-custom-glow bg-blue-600 hover:text-black hover:bg-[#b0b8bf] hover:border-[3px] hover:border-black rounded-xl"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditPop;
