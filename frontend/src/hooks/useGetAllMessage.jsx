import { MESSAGE_API } from "@/lib/helpers";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRef } from "react";
import { setChats } from "@/redux/chatSlice";

const useGetAllMessage = () => {
  const dispatch = useDispatch();
  const hasFetched = useRef(null);
  const { selectedUser } = useSelector((store) => store.auth);

  useEffect(() => {
    if (!selectedUser?._id || hasFetched.current === selectedUser?._id) return;
    const fetchAllMessages = async () => {
      try {
        const response = await axios.get(
          `${MESSAGE_API}/getmessage/${selectedUser?._id}`,
          {
            withCredentials: true,
          }
        );
        if (response.data.success) {
          // console.log(response.data);           Log For Debugging
          dispatch(setChats(response.data.message || []));
        }
      } catch (error) {
        console.log("Error While Fetching the posts", error);
      }
    };
    fetchAllMessages();
    hasFetched.current = selectedUser?._id;
  }, [selectedUser, dispatch]);
};
export default useGetAllMessage;
