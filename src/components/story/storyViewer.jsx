import { useEffect, useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import { apiFetch } from "../services/apiClient"; // ✅ import apiFetch

const StoryViewer = ({ userId, authUser, onClose }) => {
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const fetchUserStories = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await apiFetch(`/api/stories/user/${userId}`);
      setStories(Array.isArray(data) ? data : []);
      setActiveIndex(0);
      if (!data || data.length === 0) {
        toast("No stories to show", { icon: "ℹ️" });
        onClose && onClose();
      }
    } catch (err) {
      console.error("Failed to load user stories", err);
      toast.error("Failed to load stories");
      onClose && onClose();
    } finally {
      setIsLoading(false);
    }
  }, [userId, onClose]);

  useEffect(() => {
    if (!userId) return;
    fetchUserStories();
  }, [userId, fetchUserStories]);

  useEffect(() => {
    if (!stories.length) return;
    const timer = setTimeout(() => {
      setActiveIndex((prev) => Math.min(prev + 1, stories.length - 1));
    }, 5000);
    return () => clearTimeout(timer);
  }, [stories, activeIndex]);

  const goPrev = () => setActiveIndex((i) => Math.max(0, i - 1));
  const goNext = () => setActiveIndex((i) => Math.min(stories.length - 1, i + 1));

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "Escape") onClose && onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [stories.length, onClose]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center" onClick={onClose}>
        <div className="w-10 h-10 rounded-full border-4 border-white/30 border-t-white animate-spin" />
      </div>
    );
  }
  if (!stories.length) return null;

  const story = stories[activeIndex];
  const isVideo = story.type === "video";

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center" onClick={onClose}>
      {/* Close button */}
      <button
        type="button"
        className="absolute top-4 right-4 text-white text-xl z-50 hover:scale-105 transition"
        onClick={(e) => { e.stopPropagation(); onClose && onClose(); }}
        aria-label="Close"
      >
        ✕
      </button>

      {/* Prev button */}
      <div
        className="absolute top-12 bottom-0 left-0 w-1/5 flex items-center justify-start z-20"
        onClick={(e) => { e.stopPropagation(); goPrev(); }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); goPrev(); } }}
      >
        <button
          type="button"
          className="ml-4 text-white/80 text-3xl disabled:opacity-30 z-20"
          disabled={activeIndex === 0}
          aria-label="Previous story"
        >
          ‹
        </button>
      </div>

      {/* Story media */}
      <div className="w-full max-w-md aspect-[9/16] bg-black flex items-center justify-center z-10" onClick={(e) => e.stopPropagation()}>
        {isVideo ? (
          <video src={story.mediaUrl} controls autoPlay className="w-full h-full object-contain" />
        ) : (
          <img src={story.mediaUrl} alt="story" className="w-full h-full object-contain" />
        )}
      </div>

      {/* Next button */}
      <div
        className="absolute top-12 bottom-0 right-0 w-1/5 flex items-center justify-end z-20"
        onClick={(e) => { e.stopPropagation(); goNext(); }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); goNext(); } }}
      >
        <button
          type="button"
          className="mr-4 text-white/80 text-3xl disabled:opacity-30 z-20"
          disabled={activeIndex === stories.length - 1}
          aria-label="Next story"
        >
          ›
        </button>
      </div>

      {story.caption && (
        <div className="absolute bottom-10 text-white text-center w-full px-6">
          {story.caption}
        </div>
      )}

      {/* Delete button for own stories */}
      {authUser?._id && String(authUser._id) === String(story.user._id) && (
        <button
          onClick={async () => {
            try {
              await apiFetch(`/api/stories/${story._id}`, { method: "DELETE" });
              toast.success("Story deleted");

              setStories((prev) => {
                const next = prev.filter((s) => s._id !== story._id);
                if (!next.length) {
                  onClose && onClose();
                  return [];
                }
                setActiveIndex((idx) => Math.min(idx, next.length - 1));
                return next;
              });

              window.dispatchEvent(new Event("stories:refresh"));
            } catch (err) {
              toast.error(err.message);
            }
          }}
          className="absolute top-4 left-4 text-white text-sm bg-red-600/90 hover:bg-red-600 px-3 py-1 rounded-full shadow-lg flex items-center gap-2"
        >
          Delete
        </button>
      )}
    </div>
  );
};

export default StoryViewer;
