import { useSelector } from "react-redux";

const Stories = () => {
  const { user } = useSelector((store) => store.auth);
  return (
    <div className="w-full flex flex-col">
      <h1 className="text-2xl font-semibold">Stories</h1>
      <div className="story w-[90%] ml-9 h-28 mt-1 shadow-custom-glow rounded-xl bg-[#87CEFA] flex gap-1 overflow-x-scroll whitespace-nowrap items-center py-2 px-2 ">
        {[...Array(1)].map((_, index) => (
          <div
            key={index}
            className="w-[95px] flex flex-col justify-center items-center"
          >
            <div className="ring-2 ring-[#cad4dddd] rounded-full p-1">
              <img
                src={`https://ui-avatars.com/api/?name=${user.username}`}
                alt="Image"
                className="w-[66px] h-[66px] rounded-full object-cover"
              />
            </div>
            <span className=" w-[75%] text-sm text-[#333333] overflow-x-hidden whitespace-nowrap text-ellipsis">
              Storieszzehcvvscj
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stories;
