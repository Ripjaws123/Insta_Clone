import axios from "axios";
import { POST_API } from "@/lib/helpers";
import {
  Bookmark,
  BookmarkX,
  EllipsisIcon,
  Heart,
  MessageCircle,
  Share2Icon,
} from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EditPop from "./EditPop";
import Comment from "./Comment";
import { toast } from "sonner";
import { setPost } from "@/redux/postSlice";
import { setAuthUser } from "@/redux/authSlice";

const PostCard = () => {
  const dispatch = useDispatch();

  // Calling the States from Redux
  const { post } = useSelector((store) => store.post);
  const { user } = useSelector((store) => store.auth);

  // All the UseStates
  const [clickedPostId, setClickedPostId] = useState(null);
  const [commentedPostId, setCommentedPostId] = useState(null);
  const [text, setText] = useState({});

  // <--------------------------------------All the Api Functions----------------------------------->
  // Handling the Text Change
  const handleText = (e, postId) => {
    const Trim = e.target.value;
    setText((prev) => ({
      ...prev,
      [postId]: Trim,
    }));
  };

  // Like Dislike Function
  const likeDislike = async (postId, isLiked) => {
    console.log("The POst that is clicked", postId);
    try {
      const action = isLiked ? "dislikepost" : "likepost";
      const response = await axios.get(`${POST_API}/${postId}/${action}`, {
        withCredentials: true,
      });
      if (response.data.success) {
        const updatedPost = post.map((p) =>
          p._id === postId
            ? {
                ...p,
                likes: isLiked
                  ? p.likes.filter((id) => id !== user._id)
                  : [...p.likes, user._id],
              }
            : p
        );
        console.log("Updated Post", response.data);
        dispatch(setPost(updatedPost));
        toast.success(response.data.message);
      }
    } catch (error) {
      console.log("Error while LIke or Dislike", error.response);
      toast.error("Something Went Wrong", {
        description: error.response.data.message,
      });
    }
  };

  // Comment Function
  const commentPost = async (PostId) => {
    const commentText = text[PostId]?.trim();
    if (!commentText) return;

    try {
      const response = await axios.post(
        `${POST_API}/${PostId}/comment`,
        { text: commentText },
        { withCredentials: true }
      );
      if (response.data.success) {
        const newComment = response.data.comment;
        const updatedPost = post.map((p) =>
          p._id === PostId ? { ...p, comments: [...p.comments, newComment] } : p
        );
        dispatch(setPost(updatedPost));
        console.log("Succussfully Commented", response.data);
        toast.success(response.data.message);
        setText((prev) => ({ ...prev, [PostId]: "" }));
      }
    } catch (error) {
      console.log("Error while commenting", error);
      toast.error("Something Went Wrong", {
        description: error.response.data.message,
      });
    }
    console.log("comment on the Post:", commentText, PostId);
  };

  // Bookmark Function
  const bookmarkPost = async (PostId) => {
    try {
      const response = await axios.get(`${POST_API}/${PostId}/bookmarkpost`, {
        withCredentials: true,
      });
      if (response.data.success) {
        console.log("Successfully Bookmarked", response.data);
        toast.success(response.data.message);
        dispatch(setAuthUser(response.data.user));
      }
    } catch (error) {
      console.log("Error while BookMark", error);
      toast.error("Something Went Wrong", {
        description: error.response.data.message,
      });
    }
  };
  // <--------------------------------------All the Api Functions Ends----------------------------------->

  return (
    <div className="w-full flex flex-col ">
      <h1 className="text-2xl font-semibold">Posts</h1>
      <div className="w-full h-full  px-5 flex flex-col justify-center items-center">
        {post?.map((postItem) => {
          const isLiked = postItem?.likes?.includes(user?._id);
          const commentText = text[postItem._id] || "";
          return (
            <div
              key={postItem?._id}
              className="w-[70%] h-[590px] mb-6 bg-[#87CEFA] rounded-xl shadow-custom-glow"
            >
              <div className="w-full flex justify-start items-center p-3 gap-2">
                <img
                  src={
                    postItem.author.profilePic ||
                    "https://ui-avatars.com/api/?name=Rijaws+Gosh"
                  }
                  alt="pro"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex flex-col justify-center items-center">
                  <span className="font-bold">@{postItem.author.username}</span>
                </div>
                {user?._id === postItem?.author?._id && (
                  <div className="text-sm font-bold px-4 py-1 rounded-full bg-[#cad4dddd] hover:cursor-pointer">
                    <span>Author</span>
                  </div>
                )}
                <EllipsisIcon
                  className="w-6 ml-auto hover:bg-[#aeb9c3] rounded-full hover:cursor-pointer"
                  onClick={() => {
                    setClickedPostId(
                      clickedPostId === postItem._id ? null : postItem._id
                    );
                  }}
                />
              </div>

              <div className="px-8 py-2">
                <div className="w-full h-[46.5vh] rounded-xl">
                  <img
                    src={postItem.image}
                    alt="photo"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
                <div className="w-full mt-1 h-10 flex items-center gap-3">
                  <Heart
                    className={`hover:cursor-pointer ml-2 ${
                      isLiked ? "fill-[#ff0000]" : ""
                    }`}
                    onClick={() => likeDislike(postItem._id, isLiked)}
                  />
                  <MessageCircle
                    className="hover:cursor-pointer"
                    onClick={() => {
                      setCommentedPostId(
                        commentedPostId === postItem._id ? null : postItem._id
                      );
                    }}
                  />
                  <Share2Icon className="hover:cursor-pointer" />
                  <div
                    onClick={() => bookmarkPost(postItem?._id)}
                    className="ml-auto mr-2 hover:cursor-pointer"
                  >
                    {user?.bookmarks?.includes(postItem?._id) ? (
                      <BookmarkX />
                    ) : (
                      <Bookmark />
                    )}
                  </div>
                </div>
                <div className="text-md font-semibold">
                  <span>{postItem.likes.length} Like</span>
                </div>
                <div>
                  <span className="font-bold">
                    {postItem.author.username}:{" "}
                  </span>
                  <span>{postItem.caption}</span>
                </div>
                <div className="text-sm font-semibold mt-1 hover:cursor-pointer">
                  {postItem.comments.length > 0 ? (
                    <span onClick={() => setCommentedPostId(postItem?._id)}>
                      View all the {postItem.comments.length} comments
                    </span>
                  ) : (
                    <span>No Comments</span>
                  )}
                </div>
                <div className="w-full h-9 mt-3 flex justify-between items-center">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => handleText(e, postItem._id)}
                    className="w-[85%] h-full rounded-2xl pl-6 outline-none bg-[#FFF176]"
                    placeholder="Add Comment..."
                  />
                  <button
                    disabled={!commentText.trim()}
                    onClick={() => commentPost(postItem?._id)}
                    className={`text-blue-600 rounded-2xl w-[18%] h-full text-lg font-semibold ${
                      commentText.trim()
                        ? "hover:bg-[#9aa2da]"
                        : "text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Post
                  </button>
                </div>
              </div>
              {/* Edit Poopup */}
              {clickedPostId === postItem._id && (
                <EditPop
                  isclicked={true}
                  setIsclicked={() => setClickedPostId(null)}
                  postOne={postItem}
                />
              )}
              {/* Comment Prop */}
              {commentedPostId === postItem._id && (
                <Comment
                  comment={true}
                  setComment={() => setCommentedPostId(null)}
                  commentPost={() => commentPost(postItem?._id)}
                  singlePost={postItem}
                  textChange={(e) => handleText(e, postItem?._id)}
                  likeDislike={() => likeDislike(postItem?._id, isLiked)}
                  newtext={text[postItem?._id] || ""}
                  newsetText={setText}
                  comtxt={text[postItem?._id] || ""}
                  isliked={isLiked}
                  bookmarkPost={() => bookmarkPost(postItem?._id)}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PostCard;
