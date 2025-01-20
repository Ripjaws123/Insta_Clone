import logo from "../../assets/TextLogo.png";
import search from "../../assets/Search.png";
import share from "../../assets/paper-plane.svg";
import bell from "../../assets/bell.svg";
import create from "../../assets/grid.svg";
import { ChevronDown } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const { likenotification } = useSelector((store) => store.rtmnotification);
  return (
    <div className="w-full h-[60px] bg-[#007bffd4] backdrop-blur-lg rounded-2xl flex justify-between items-center px-6 shadow-lg sticky top-0">
      {/* Logo */}
      <div className=" flex justify-center items-center">
        <img src={logo} alt="logo" className="w-[100px]" />
      </div>
      {/* Search */}
      <div className="w-[350px] ml-20 flex h-10 justify-center items-center bg-[#87CEFA] p-5 gap-2 rounded-2xl">
        <img
          src={search}
          alt="search"
          className="hover:cursor-pointer w-[14px]"
        />
        <input
          type="text"
          className="bg-transparent w-full outline-none placeholder:text-gray-600 placeholder:text-sm placeholder:font-semibold pb-[2px]"
          placeholder="Search"
        />
      </div>
      {/* Oter Ions */}
      <div className=" w-[280px] flex md:justify-center md:gap-4 items-center ">
        <Link to={"/"} className=" hover:cursor-pointer">
          <img
            src={create}
            alt="create"
            className="p-2 rounded-full bg-[#87CEFA] w-[38px]"
          />
        </Link>
        <Link to={"/"}>
          <img
            src={share}
            alt="share"
            className="p-2 rounded-full bg-[#87CEFA] w-[38px]"
          />
        </Link>
        <Link to={"/notifications"} className=" hover:cursor-pointer relative">
          <img
            src={bell}
            alt="bell"
            className="p-2 rounded-full bg-[#87CEFA] w-[38px]"
          />
          {likenotification.length > 0 && (
            <span className="w-[14px] h-[14px] flex justify-center items-center pr-[1px] pb-[1px] text-xs text-[#333333] bg-[#FFF176] rounded-full absolute top-[1px] right-[1px]">
              {likenotification.length}
            </span>
          )}
        </Link>
        <div className="p-1 rounded-full bg-[#87CEFA] flex justify-center items-center gap-1 hover:cursor-pointer md:hidden">
          <img
            src={
              user?.profilePic ||
              `https://ui-avatars.com/api/?name=${user?.username}`
            }
            alt="profile"
            className="w-8 h-8 rounded-full object-fill "
          />
          <span className="font-semibold">{user?.username}</span>
          <ChevronDown className="w-[18px]" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
