import PostCard from "@/components/ui/PostCard";
import Stories from "@/components/ui/Stories";
import SuggestionCard from "@/components/ui/SuggestionCard";

import { useState } from "react";

const Home = () => {
  
  const [post, setPost] = useState("");

  const handleSubmit = async (data) => {
    console.log("Form Submitted: ", data);
    setPost(data);
  };
  return (
    <div className="w-[77%] h-full flex  px-5 py-2">
      {/* Left */}
      <div className="w-[70%] h-full flex flex-col items-center ">
        {/* stories */}
        <Stories />
        {/* posts */}
        <PostCard
          onclick={handleSubmit}
        />
      </div>
      {/* Right */}
      <div className="w-[30%] pt-4">
        <SuggestionCard />
      </div>

     
    </div>
  );
};

export default Home;
