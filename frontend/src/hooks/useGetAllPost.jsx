import { POST_API } from "@/lib/helpers";
import { setPost } from "@/redux/postSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRef } from "react";

const useGetAllPosts = () => {
  const dispatch = useDispatch();
  const hasFetched = useRef(false);
  useEffect(() => {
    if (hasFetched.current) return;
    const fetchAllPosts = async () => {
      try {
        const response = await axios.get(`${POST_API}/getpost/all`, {
          withCredentials: true,
        });
        if (response.data.success) {
          // console.log(response.data);           Log For Debugging
          dispatch(setPost(response.data.posts));
        }
      } catch (error) {
        console.log("Error While Fetching the posts", error);
      }
    };
    fetchAllPosts();
    hasFetched.current = true;
  }, [dispatch]);
};
export default useGetAllPosts;
