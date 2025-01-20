// import { useSelector } from "react-redux";

const Bookmark = () => {
  //   const { user } = useSelector((state) => state.auth);
  //   const displayPost = user?.bookmarks;
  return (
    <div className="w-[77%] h-[80vh] flex items-center justify-center px-5 py-2">
      <div className="w-full text-5xl font-semibold flex justify-center">
        Under Construction
      </div>
      {/* <div className="w-full bg-[#b6abab] mt-3 grid grid-cols-4 justify-items-center gap-4 rounded-xl p-3">
        {displayPost?.map((postItem) => {

          return (
            <div
              key={postItem?._id}
              className="w-[17vw] h-[60vh] shadow-custom-glow shadow-slate-900 relative group border  rounded-xl hover:cursor-pointer"
            >
              <img
                src={postItem?.image}
                alt=""
                className="w-full h-full  rounded-xl aspect-auto"
              />

            </div>
          );
        })}
      </div> */}
    </div>
  );
};

export default Bookmark;
