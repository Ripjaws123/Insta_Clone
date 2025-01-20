import { USER_API } from "@/lib/helpers";
import { setUserProfile } from "@/redux/authSlice";
import axios from "axios";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

const useGetUserProfile = (userId) => {
  const dispatch = useDispatch();
  const hasFetched = useRef(false);
  useEffect(() => {
    if (hasFetched.current) return;
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`${USER_API}/${userId}/profile`, {
          withCredentials: true,
        });
        if (response.data.success) {
          // console.log("The Fetched profile User", response.data);
          dispatch(setUserProfile(response.data.user));
        }
      } catch (error) {
        console.log("Error while Fetching User Profile", error);
      }
    };
    fetchUserProfile();
    hasFetched.current = true;
  }, [userId, dispatch]);
};

export default useGetUserProfile;
