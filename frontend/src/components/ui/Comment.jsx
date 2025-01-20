import { useEffect, useState } from "react";
import {
  Bookmark,
  BookmarkX,
  EllipsisIcon,
  Heart,
  Share2Icon,
} from "lucide-react";
import Edit2Pop from "./Edit2Pop";
import { useSelector } from "react-redux";

const Comment = ({
  comment,
  setComment,
  commentPost,
  singlePost,
  textChange,
  bookmarkPost,
  newtext,
  newsetText,
  likeDislike,
  comtxt,
  isliked,
}) => {
  const [edit, setEdit] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const { user } = useSelector((store) => store.auth);

  // Transition effect
  useEffect(() => {
    if (comment) {
      setIsOpen(true);
    }
  }, [comment]);

  // Close with transition
  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setComment(false);
    }, 100); // Match transition duration
  };

  // <-----------------Testing Logs---------------------->
  // console.log("The Full Post Details", singlePost);
  // console.log("The Comment Function", commentPost);
  // console.log("The Text function", textChange);

  if (!comment) return null;
  return (
    <div className="fixed top-0 left-0 w-full h-full  bg-black bg-opacity-50 backdrop-blur-[2px] flex items-center justify-center z-50">
      <button
        onClick={handleClose}
        className="w-10 h-10 bg-[#FFF176] shadow-custom-glow shadow-slate-800 rounded-xl absolute top-12 right-52"
      >
        X
      </button>
      <div
        className={`transition-transform duration-300 ${
          isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0"
        } w-[55%] h-[75%] bg-[#ffffff] shadow-custom-glow shadow-slate-800 p-2 rounded-2xl flex`}
      >
        {/* left */}
        <div className="h-full w-[40%]">
          <img
            src={singlePost?.image}
            alt="post"
            className="w-full h-full object-contain rounded-xl"
          />
        </div>
        {/* right */}
        <div className="h-full w-[60%] px-3 flex flex-col items-center">
          {/* top */}
          <div className="w-full mt-2  flex justify-between items-center ">
            <img
              src={
                singlePost?.author?.profilePic ||
                "https://ui-avatars.com/api/?name=Rijaws+Gosh"
              }
              alt="profile"
              className="w-12 h-12 rounded-full object-cover"
            />
            <span className="font-bold pl-3">
              {singlePost?.author?.username}
            </span>
            <EllipsisIcon
              className="w-6 ml-auto hover:bg-[#aeb9c3] rounded-full hover:cursor-pointer"
              onClick={() => setEdit(true)}
            />
          </div>
          {/* comment */}
          <div className="w-full h-full mt-2 overflow-y-scroll">
            {singlePost.comments.map((comment) => (
              <div key={comment?._id} className=" w-full flex justify-between">
                <div className="w-[12%]">
                  <img
                    src={
                      comment?.author?.profilePic ||
                      "https://ui-avatars.com/api/?name=Rijaws+Gosh"
                    }
                    alt="auth"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </div>
                <div className="w-[90%] flex mt-2">
                  <p className="font-semibold ml-1 mb-1">
                    {comment?.author?.username}{" "}
                    <span className="text-sm font-normal ml-1">
                      {comment?.text}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
          {/* bottom */}
          <div className="w-full mt-2 flex flex-col justify-evenly items-center ">
            <div className="w-full flex p-2 mt-1 h-10 items-center gap-3">
              <Heart
                className={`hover:cursor-pointer ml-2 ${
                  isliked ? "fill-[#ff0000]" : ""
                }`}
                onClick={likeDislike}
              />
              <Share2Icon className="hover:cursor-pointer" />
              <div
                onClick={bookmarkPost}
                className="ml-auto mr-2 hover:cursor-pointer"
              >
                {user?.bookmarks?.includes(singlePost?._id) ? (
                  <BookmarkX />
                ) : (
                  <Bookmark />
                )}
              </div>
            </div>
            <span className="w-full ml-14">
              {singlePost.likes.length} likes
            </span>
            <div className="w-full flex justify-evenly h-9 mt-3">
              <input
                type="text"
                onChange={textChange}
                name="text"
                value={newtext}
                className="w-[78%] h-full rounded-2xl pl-6 outline-none bg-[#af9e9e] placeholder:text-slate-600"
                placeholder="Add Comment..."
              />
              <button
                disabled={!newtext.trim()}
                onClick={commentPost}
                className={`text-blue-600 rounded-2xl w-[18%] h-full text-lg font-semibold ${
                  newtext.trim()
                    ? "hover:bg-[#9aa2da]"
                    : " text-gray-500 cursor-not-allowed"
                }`}
              >
                Post
              </button>
            </div>
          </div>
        </div>

        <Edit2Pop edit={edit} setEdit={setEdit} />
      </div>
    </div>
  );
};

export default Comment;
