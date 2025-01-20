import { USER_API } from "@/lib/helpers";
import { setAuthUser } from "@/redux/authSlice";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const EditPage = () => {
  const { user } = useSelector((store) => store.auth);
  const [editForm, setEditForm] = useState({
    profilepicture: null,
    coverpicture: null,
    bio: user?.bio,
    gender: user?.gender,
  });
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const profilePic = useRef();
  const coverPic = useRef();

  //   Handle Text
  const handleText = (e) => {
    const { name, value } = e.target;
    setEditForm({
      ...editForm,
      [name]: value,
    });
    // console.log(editForm.bio, editForm.gender);
  };

  // Handle File
  const handleFile = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setEditForm({
        ...editForm,
        [name]: files[0],
      });
    }
  };

  // Handle Profile Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // console.log("The Edited Form",editForm);
    const formdata = new FormData();
    formdata.append("bio", editForm.bio);
    formdata.append("gender", editForm.gender);
    if (editForm.profilepicture) {
      formdata.append("profilepicture", editForm.profilepicture);
    }
    if (editForm.coverpicture) {
      formdata.append("coverpicture", editForm.coverpicture);
    }

    try {
      const response = await axios.post(`${USER_API}/profile/edit`, formdata, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.success) {
        console.log("Success Editing the Profile", response.data);
        dispatch(setAuthUser(response.data.user));
        toast.success("Profile Edited", {
          description: response.data.message,
        });
        navigate(`/profile/${user?._id}`);
      }
    } catch (error) {
      console.log("error while Editing the Profile", error.response);
      toast.error("Internal Server Error", {
        description: error.response.data.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-[77%] absolute -z-10 h-full mt-4 px-5 py-2 flex flex-col items-center">
      <h2 className="mr-auto ml-5 text-3xl font-bold mb-3">Edit Profile</h2>

      {/* Profile */}
      <div className="bg-[#87CEFA] w-[55vw] h-[48vh] flex mt-12 items-center p-4 rounded-xl ">
        <div className="w-[50%] h-[48vh] pt-4 relative ">
          <div className="w-full h-[70%]  ">
            <img
              src={
                user?.coverPic ||
                `https://ui-avatars.com/api/?name=${user?.username}`
              }
              alt=""
              className="w-full h-full object-cover rounded-xl shadow-custom-glow "
            />
          </div>
          <div className=" rounded-full absolute bottom-12 left-[66%] ring-4 ring-[#cad4dd8b]">
            <img
              src={
                user?.profilePic ||
                `https://ui-avatars.com/api/?name=${user?.username}`
              }
              alt=""
              className="w-28 h-28 rounded-full object-fill shadow-custom-glow"
            />
          </div>
        </div>
        <div className="w-[50%] h-full flex flex-col justify-between pl-7">
          <div className="flex flex-col justify-center mt-10 ">
            <span className="text-lg font-semibold">@{user?.username}</span>
            <span className="mt-4 ml-1">{user?.bio}</span>
          </div>
          <div className="flex items-center justify-around pb-6">
            <input
              type="file"
              ref={profilePic}
              name="profilepicture"
              onChange={handleFile}
              accept=".jpg,.jpeg,.png"
              hidden
            />
            <input
              type="file"
              ref={coverPic}
              name="coverpicture"
              onChange={handleFile}
              accept=".jpg,.jpeg,.png"
              hidden
            />
            <button
              onClick={() => profilePic.current.click()}
              className="w-[40%] h-11 rounded-3xl font-semibold bg-[#FFF176] border-2 border-slate-400 text-[#333333] hover:shadow-custom-glow"
            >
              Change Profile
            </button>
            <button
              onClick={() => coverPic.current.click()}
              className="w-[40%] h-11 rounded-3xl font-semibold bg-[#FFF176] border-2 border-slate-400 text-[#333333] hover:shadow-custom-glow"
            >
              Change Cover
            </button>
          </div>
        </div>
      </div>

      <div>
        {/* Bio */}
        <div className="flex flex-col w-[55vw] mt-6">
          <span className="text-xl font-semibold">Bio</span>
          <textarea
            name="bio"
            value={editForm.bio}
            onChange={handleText}
            className="h-28 rounded-xl bg-[#87CEFA] pl-3 mt-2 pt-2 resize-none outline-none placeholder:text-[#333333] placeholder:text-sm placeholder:font-semibold"
          ></textarea>
        </div>

        {/* Gender */}
        <div className="flex flex-col w-[55vw] mt-10">
          <span className="text-xl text-[#333333] font-semibold">Gender</span>
          <select
            name="gender"
            value={editForm.gender}
            onChange={handleText}
            className="border border-gray-300 rounded-lg px-4 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>
              Select
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        {/* Submit */}
        <div className="w-[55vw] mt-10 flex items-center justify-end">
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-[25%] h-12 text-lg text-[#333333] rounded-2xl font-semibold bg-[#FFF176] border-2 border-slate-400 hover:shadow-custom-glow"
          >
            {isLoading ? (
              <Loader2 className="animate-spin w-full " />
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPage;
