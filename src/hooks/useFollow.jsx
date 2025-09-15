import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { apiFetch } from "../services/apiClient";

const useFollow = () => {
  const queryClient = useQueryClient();

  const { mutate: follow, isLoading } = useMutation({
    mutationFn: async (userId) => {
      await apiFetch(`/api/users/follow/${userId}`, { method: "POST" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] });
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success("Followed successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to follow user");
    },
  });

  return { follow, isLoading };
};

export default useFollow;
