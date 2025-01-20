import { useEffect, useState } from "react";

const ButtonText = [
  "Report",
  "Unfollow",
  "Add to Favourite",
  "Go to Post",
  "share to..",
  "copy link",
  "abbout this account",
];

// eslint-disable-next-line react/prop-types
const Edit2Pop = ({ edit, setEdit }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Transition effect
  useEffect(() => {
    if (edit) {
      setIsOpen(true); // Open modal
    } else {
      setIsOpen(false); // Close modal
    }
  }, [edit]);

  // Close with transition
  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setEdit(false);
    }, 60); // Match transition duration
  };

  if (!edit) return null;
  return (
    <div className="fixed top-0 left-0 w-full h-full backdrop-blur-[1px] flex items-center justify-center z-50">
      <button
        onClick={handleClose}
        className="w-10 h-10 hover:bg-slate-800 bg-slate-600 shadow-custom-glow shadow-slate-800 hover:text-white rounded-xl absolute top-[3%] right-[22%]"
      >
        X
      </button>
      <div
        className={`transition-transform duration-200 ${
          isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0"
        } w-[35%] h-[75%] bg-white shadow-custom-glow shadow-black px-4 pt-2 pb-4 rounded-2xl`}
      >
        <div className="w-full h-full flex flex-col justify-evenly mt-2">
          {ButtonText.map((text, index) => (
            <button
              key={index}
              className="text-lg text-white font-semibold w-full h-10 shadow-custom-glow bg-slate-600 hover:text-black hover:bg-[#b0b8bf] hover:border-[3px] hover:border-black rounded-xl"
            >
              {text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Edit2Pop;
