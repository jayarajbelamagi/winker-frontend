// src/pages/followersfollowing/FollowersPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import FollowersFollowingSkeleton from "../../skeletons/FollowersFollowingSkeleton";
import { apiFetch } from "../../services/apiClient";
// import FollowButton from "../../components/FollowButton"; // optional

const FollowersPage = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFollowers = async () => {
      setLoading(true);
      try {
        const data = await apiFetch(`/api/users/${username}/followers`);
        setFollowers(data);
      } catch (error) {
        console.error("Error fetching followers:", error);
        toast.error(error.message || "Failed to fetch followers");
      } finally {
        setLoading(false);
      }
    };

    if (username) fetchFollowers();
  }, [username]);

  if (loading) return <FollowersFollowingSkeleton />;

  return (
    <div className="max-w-2xl mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-4 px-4">Followers</h2>
      {followers.length === 0 ? (
        <p className="px-4 text-gray-500">No followers found.</p>
      ) : (
        <ul>
          {followers.map((user) => (
            <li
              key={user._id}
              className="flex items-center justify-between p-4 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer border-b"
            >
              <div
                className="flex items-center"
                onClick={() => navigate(`/profile/${user.username}`)}
              >
                <img
                  src={user.profileImg || "/avatar-placeholder.png"}
                  alt={user.username}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-4">
                  <p className="font-semibold text-gray-900 dark:text-white">{user.fullName}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">@{user.username}</p>
                  {user.bio && (
                    <p className="text-gray-500 dark:text-gray-400 text-sm truncate w-64">{user.bio}</p>
                  )}
                </div>
              </div>
              {/* Optional follow/unfollow button */}
              {/* <FollowButton userId={user._id} /> */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FollowersPage;
