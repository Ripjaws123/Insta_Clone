import { USER_API } from "@/lib/helpers";
import { setsuggestedUser } from "@/redux/authSlice";
import axios from "axios";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

const useGetSuggestedUser = () => {
  const dispatch = useDispatch();
  const hasFetched = useRef(false);
  useEffect(() => {
    if (hasFetched.current) return;
    const fetchSuggestedUser = async () => {
      try {
        const response = await axios.get(`${USER_API}/suggestuser`, {
          withCredentials: true,
        });
        if (response.data.success) {
          // console.log("The Suggested Users", response.data);           Log For Debugging
          dispatch(setsuggestedUser(response.data.users));
        }
      } catch (error) {
        console.log("Error while fetching Suggested Users", error);
      }
    };
    fetchSuggestedUser();
    hasFetched.current = true;
  }, [dispatch]);
};

export default useGetSuggestedUser;
