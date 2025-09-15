import { useState } from "react";
import StoryBar from "../../components/story/storyBar";
import Posts from "../../components/common/Posts";
import CreatePost from "./CreatePost";

const Home = ({ authUser }) => {
  const [feedType, setFeedType] = useState("forYou");

  if (!authUser) return <p className="p-4 text-center text-gray-500">Loading...</p>;

  const feedTabs = [
    { key: "forYou", label: "For you" },
    { key: "following", label: "Following" },
  ];

  return (
    <div className="flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen">
      {/* Feed Type Tabs */}
      <div className="flex w-full border-b border-gray-700">
        {feedTabs.map((tab) => (
          <div
            key={tab.key}
            className={`flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative ${
              feedType === tab.key ? "font-bold" : ""
            }`}
            onClick={() => setFeedType(tab.key)}
          >
            {tab.label}
            {feedType === tab.key && (
              <div className="absolute bottom-0 w-10 h-1 rounded-full bg-primary"></div>
            )}
          </div>
        ))}
      </div>

      {/* Story Section */}
      <div className="p-4 border-b border-gray-700">
        <StoryBar authUser={authUser} />
      </div>

      {/* Posts Section */}
      <div className="p-4 flex flex-col gap-4">
        <CreatePost />
        <Posts feedType={feedType} />
      </div>
    </div>
  );
};

export default Home;
