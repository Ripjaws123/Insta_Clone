import { POST_API, readFileDatauri } from "@/lib/helpers";
import { setAuthUser } from "@/redux/authSlice";
import { setPost } from "@/redux/postSlice";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

// eslint-disable-next-line react/prop-types
const CreatePost = ({ create, setCreate, user, setActiveTab }) => {
  const { post } = useSelector((store) => store.post);
  const dispatch = useDispatch();
  const imageref = useRef();

  const [createPost, setCreatePost] = useState({
    caption: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);

  //   Handling the Files and The Text
  const PostHandler = async (e) => {
    const { name, files } = e.target;
    if (name === "image" && files.length > 0) {
      const file = files[0];
      try {
        const dataUri = await readFileDatauri(file);
        setImagePreview(dataUri);
        setCreatePost((prev) => ({ ...prev, image: file }));
      } catch (error) {
        console.error("Error reading file:", error);
      }
    } else if (name !== "image") {
      // Handle non-file input (e.g., caption)
      const { value } = e.target;
      setCreatePost((prev) => ({ ...prev, [name]: value }));
    }
  };

  //   handling the Creating Post
  const PostSubmit = async () => {
    setLoading(true);
    const formdata = new FormData();
    formdata.append("caption", createPost.caption);
    if (imagePreview) {
      formdata.append("image", createPost.image);
    }
    console.log("Form Submited:", createPost);
    try {
      const response = await axios.post(`${POST_API}/addpost`, formdata, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.success) {
        console.log("Create post Success", response.data);
        dispatch(setPost([response.data.post, ...post]));
        toast.success("Post Created", {
          description: response.data.message,
        });
        setCreatePost({
          caption: "",
          image: null,
        });
        setImagePreview("");
        dispatch(setAuthUser(response.data.user));
      }
    } catch (error) {
      console.log("Error while creating the post", error.response);
      toast.error("Error", {
        description: error.response.data.message,
      });
    } finally {
      setLoading(false);
      setCreate(false);
    }
  };

  if (!create) return null;
  return (
    <div className="fixed top-0 left-0 w-full h-full  bg-black bg-opacity-45 backdrop-blur-[2px] flex items-center justify-center z-50">
      <button
        onClick={() => {
          setCreate(false);
          setImagePreview("");
          setActiveTab(null);
        }}
        className="w-10 h-10 bg-[#FFF176] shadow-custom-glow shadow-slate-800 text-[#333333] rounded-xl absolute top-[20%] right-[32%]"
      >
        X
      </button>
      <div
        className={` w-[28%]  ${
          imagePreview ? "h-[85%]" : "h-fit"
        } bg-[#F5F5F5] shadow-custom-glow shadow-black px-4 pt-2 pb-4 rounded-2xl`}
      >
        <h1 className="text-lg font-bold">Create New Post</h1>
        {/* UserDetails */}
        <div className="w-full  flex gap-2 mt-1">
          <div className="mt-1">
            <img
              src={
                user?.profilePic ||
                `https://ui-avatars.com/api/?name=${user?.username}`
              }
              alt="user"
              className="w-12 h-12 rounded-full object-cover bg-black shadow-custom-glow shadow-slate-400"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold">{user?.username}</span>
            <span className="h-10 overflow-y-scroll text-sm">{user?.bio}</span>
          </div>
        </div>
        <div>
          <textarea
            name="caption"
            value={createPost.caption}
            onChange={PostHandler}
            className="w-full h-10 rounded-2xl bg-[#FFF176] pl-3 pt-2 placeholder:text-[#333333] outline-none resize-none"
            placeholder="Caption.."
          />
        </div>
        <div className="w-full h-full mt-2 flex justify-start items-center flex-col">
          {imagePreview && (
            <div className="w-full h-[275px]">
              <img
                src={imagePreview}
                alt="prevew"
                className="w-full h-full object-contain  rounded-xl"
              />
            </div>
          )}
          <input
            ref={imageref}
            accept=".jpg,.jpeg,.png"
            type="file"
            name="image"
            onChange={PostHandler}
            hidden
          />
          <button
            onClick={() => imageref.current.click()}
            className="w-fit px-5 py-3 font-semibold shadow-custom-glow text-[#333333] rounded-2xl mt-6 bg-[#87CEFA] hover:bg-[#007BFF]"
          >
            Select from Computer
          </button>
          <span className="text-xs text-red-700">
            Upload only .JPG / .PNG files
          </span>
          {imagePreview && (
            <div className="w-full h-12 rounded-xl mt-3 bg-slate-800">
              <button
                onClick={PostSubmit}
                className="w-full h-full text-lg font-semibold text-white"
              >
                {loading ? (
                  <Loader2 className=" animate-spin w-full h-6" />
                ) : (
                  "Post"
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
