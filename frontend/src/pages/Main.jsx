import Navbar from "@/components/Navbar/navbar";
import Sidebar from "@/components/Sidebar/sidebar";
import useGetAllPosts from "@/hooks/useGetAllPost";
import useGetSuggestedUser from "@/hooks/useGetSuggestedUser";
import { Outlet } from "react-router-dom";

const Main = () => {
  useGetAllPosts();
  useGetSuggestedUser();
  return (
    <>
      <Navbar />
      <Sidebar />
      <div className=" w-full h-full flex justify-end ">
        <Outlet />
      </div>
    </>
  );
};

export default Main;
