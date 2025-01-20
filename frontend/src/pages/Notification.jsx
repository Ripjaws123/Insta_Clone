import { useSelector } from "react-redux";

const Notification = () => {
  const { likenotification } = useSelector((store) => store.rtmnotification);

  // console.log("likenotification", likenotification);

  return (
    <div className="w-[77%] h-full flex flex-col items-center  px-5 py-2">
      <div>
        <h1 className="text-2xl font-semibold">Notifications</h1>
      </div>
      <div className="w-full h-[63vh] overflow-y-scroll rounded-b-xl mt-1">
        {likenotification?.map((notification, index) => (
          <div
            key={notification.userId || index}
            className="w-full flex justify-center items-center gap-3 mt-2"
          >
            <img
              src={
                notification?.profilePic ||
                `https://ui-avatars.com/api/?name=${notification?.userDetails?.username}`
              }
              className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-500"
            />
            <h1 className="text-lg font-semibold">{notification?.message}</h1>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notification;
