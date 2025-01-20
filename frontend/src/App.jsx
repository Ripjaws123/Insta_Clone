import Home from "./pages/Home";
import Login from "./pages/Login";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Profile from "./pages/Profile";
import Main from "./pages/Main";
import EditPage from "./pages/EditPage";
import Message from "./components/Message/message";
import { io } from "socket.io-client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSocket } from "./redux/socketSlice";
import { setOnlineUsers } from "./redux/chatSlice";
import { setLikeNotification } from "./redux/rtnSlice";
import Notification from "./pages/Notification";
import Bookmark from "./pages/Bookmark";
import ProtectedRoutes from "./components/ProtectedRoutes";

const BrowserRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoutes>
        <Main />
      </ProtectedRoutes>
    ),
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoutes>
            <Home />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/profile/:id",
        element: (
          <ProtectedRoutes>
            <Profile />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/editprofile",
        element: (
          <ProtectedRoutes>
            <EditPage />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/messages",
        element: (
          <ProtectedRoutes>
            <Message />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/notifications",
        element: (
          <ProtectedRoutes>
            <Notification />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/bookmarks",
        element: (
          <ProtectedRoutes>
            <Bookmark />
          </ProtectedRoutes>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  useEffect(() => {
    if (!user) return;
    let socketio;

    if (user) {
      // Establish socket connection
      socketio = io(`http://localhost:5001`, {
        query: { userId: user?._id },
        transports: ["websocket"],
      });

      // Save socket instance in Redux
      dispatch(setSocket(socketio));

      // Handle socket connection
      // socketio.on("connect", () => {
      //   console.log("Connected to the server with ID:", socketio.id);
      // });

      // Handle socket connection error
      // socketio.on("connect_error", (err) => {
      //   console.log("Error Connecting to the server with ID:", err);
      // });

      // Listen for online users
      socketio.on("onlineUsers", (onlineUsers) => {
        // console.log("Online Users:", onlineUsers);
        dispatch(setOnlineUsers(onlineUsers));
      });

      // handle notifications
      socketio.on("notification", (notification) => {
        // console.log("Notifications comming:", notification);
        dispatch(setLikeNotification(notification));
      });

      // Handle socket disconnection on cleanup
      return () => {
        if (socketio) {
          socketio.disconnect();
          // console.log("Socket disconnected");
          dispatch(setSocket(null));
          dispatch(setOnlineUsers([]));
        }
      };
    }
  }, [user, dispatch]);
  return (
    <>
      <RouterProvider router={BrowserRouter} />
    </>
  );
}

export default App;
