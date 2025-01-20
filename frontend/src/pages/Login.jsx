import { useEffect, useState } from "react";
import axios from "axios";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { USER_API } from "@/lib/helpers";
import { toast } from "sonner";
import { LoaderPinwheel } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const [islogin, setIslogin] = useState(true);
  const [isloading, setIsLoading] = useState(false);
  const [formdata, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (islogin) {
        // Login
        console.log("login data--->", {
          email: formdata.email,
          password: formdata.password,
        });
        try {
          const response = await axios.post(
            `${USER_API}/login`,
            {
              email: formdata.email,
              password: formdata.password,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
              withCredentials: true,
            }
          );
          console.log("response--->", response.data);
          if (response.data.success) {
            toast.success("Login Successfull", {
              description: response.data.message,
            });
            setFormData({
              email: "",
              password: "",
            });
            dispatch(setAuthUser(response.data.user));
            navigate("/");
          }
        } catch (error) {
          console.log("error in login --->", error.response.data);
          toast.error("Login Failed", {
            description: error.response.data.message,
          });
        }
      } else {
        // Signup
        console.log("signup data--->", formdata);
        try {
          const response = await axios.post(`${USER_API}/register`, formdata, {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          });
          console.log("response--->", response.data);
          if (response.data.success) {
            toast.success("Registration Successfull", {
              description: response.data.message,
            });
          }
          setIslogin(!islogin);
          setFormData({
            username: "",
          });
        } catch (error) {
          console.log("error in signup --->", error.response.data);
          toast.error("Registration Failed", {
            description: error.response.data.message,
          });
        }
      }
    } catch (error) {
      console.log("error--->", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  });
  return (
    <>
      <div className="w-full h-[95.6vh] shadow-custom-glow shadow-black rounded-3xl flex justify-center items-center bg-gradient-to-bl  from-orange-500 to-purple-600 p-6">
        {/* Main Section */}
        <div className="w-[60%] h-[80%] flex justify-center items-center gap-3  bg-[#ffffff52]  rounded-3xl p-6 shadow-custom-glow shadow-black">
          {/* Left Section */}
          <div className="w-[40%] h-full flex justify-center items-center ">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-[90%] ml-9"
            >
              <CarouselContent>
                <CarouselItem>
                  <img
                    className="w-full rounded-lg object-contain"
                    src="https://images.unsplash.com/photo-1511485977113-f34c92461ad9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                    alt="login"
                  />
                </CarouselItem>
                <CarouselItem>
                  <img
                    className="w-full rounded-lg object-contain"
                    src="https://images.unsplash.com/photo-1511485977113-f34c92461ad9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                    alt="login"
                  />
                </CarouselItem>
                <CarouselItem>
                  <img
                    className="w-full rounded-lg object-contain"
                    src="https://images.unsplash.com/photo-1511485977113-f34c92461ad9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                    alt="login"
                  />
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>

          {/* Right Section */}
          <div className="w-[60%] h-[80%]  flex flex-col justify-center items-center">
            <div className="w-full h-[20%] flex justify-center items-center flex-col gap-4">
              <h1 className="text-5xl font-bold text-white">
                {islogin ? "LOGIN" : "SIGNUP"}
              </h1>
              <h3 className="text-[19px] font-semibold text-white p-2 bg-slate-500 rounded-lg shadow-inner shadow-slate-600">
                {islogin
                  ? "Login to Get Started"
                  : "Signup to Get Started and Amaze"}
              </h3>
            </div>
            <form
              onSubmit={handleSubmit}
              className="w-full h-full flex flex-col justify-center items-center gap-6 mt-10"
            >
              {/* Username */}
              {!islogin && (
                <div className="w-[70%] flex justify-between items-center">
                  <input
                    type="text"
                    name="username"
                    value={formdata.username}
                    onChange={handleChange}
                    required={!islogin}
                    placeholder="Username"
                    className="w-full h-10 rounded-xl pl-4 placeholder:text-md placeholder:font-semibold bg-[#ffffffbc] outline-none shadow-md"
                  />
                </div>
              )}

              <div className="w-[70%] flex justify-between items-center">
                {/* <label htmlFor="Email" className="text-xl font-semibold">
                  Email
                </label> */}
                <input
                  type="email"
                  name="email"
                  value={formdata.email}
                  onChange={handleChange}
                  required
                  placeholder="Email"
                  className="w-full h-10 rounded-xl pl-4 placeholder:text-md placeholder:font-semibold bg-[#ffffffbc] outline-none shadow-md"
                />
              </div>
              <div className="w-[70%] flex justify-between items-center">
                {/* <label htmlFor="Password" className="text-xl font-semibold">
                  Password
                </label> */}
                <input
                  type="password"
                  name="password"
                  value={formdata.password}
                  onChange={handleChange}
                  required
                  placeholder="Password"
                  className="w-full h-10 rounded-xl pl-4 placeholder:text-md placeholder:font-semibold bg-[#ffffffbc] outline-none shadow-md"
                />
              </div>
              <div className="w-[70%] h-10">
                <button
                  type="submit"
                  className="w-full h-10 rounded-sm bg-zinc-500 text-lg font-semibold shadow-md"
                  disabled={isloading}
                >
                  {isloading ? (
                    <LoaderPinwheel className="animate-spin w-full h-6 " />
                  ) : islogin ? (
                    "Login"
                  ) : (
                    "Signup"
                  )}
                </button>
              </div>
              <h3 className="text-sm">
                {islogin
                  ? "Don't have an account?"
                  : "Already have an account?"}
                <span
                  className="font-semibold text-sm hover:underline hover:cursor-pointer hover:text-blue-800"
                  onClick={() => setIslogin(!islogin)}
                >
                  {islogin ? "Signup" : "Login"}
                </span>
              </h3>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
