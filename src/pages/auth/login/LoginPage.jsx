import { useState } from "react";
import { Link } from "react-router-dom";

import XSvg from "../../../components/svgs/X";
import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { apiFetch } from "../../../utils/apiFetch";

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: loginMutation, isLoading, isError, error } = useMutation({
    mutationFn: async ({ username, password }) => {
      return apiFetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
    },
    onSuccess: () => {
      toast.success("Logged in successfully!");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      setFormData({ username: "", password: "" });
    },
    onError: (err) => {
      toast.error(err.message || "Login failed");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation(formData);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-screen-xl mx-auto flex h-screen">
      <div className="flex-1 hidden lg:flex items-center justify-center">
        <XSvg className="lg:w-2/3 fill-white" />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center px-4">
        <form className="flex gap-4 flex-col w-full max-w-md" onSubmit={handleSubmit}>
          <XSvg className="w-24 lg:hidden fill-white mx-auto" />
          <h1 className="text-4xl font-extrabold text-white text-center">{"Let's go."}</h1>

          <label className="input input-bordered rounded flex items-center gap-2">
            <MdOutlineMail />
            <input
              type="text"
              className="grow bg-transparent outline-none"
              placeholder="Username"
              name="username"
              onChange={handleInputChange}
              value={formData.username}
              aria-label="Username"
              required
            />
          </label>

          <label className="input input-bordered rounded flex items-center gap-2">
            <MdPassword />
            <input
              type={showPassword ? "text" : "password"}
              className="grow bg-transparent outline-none"
              placeholder="Password"
              name="password"
              onChange={handleInputChange}
              value={formData.password}
              aria-label="Password"
              required
            />
            <button
              type="button"
              className="text-sm text-gray-300"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </label>

          <button
            type="submit"
            className="btn rounded-full btn-primary text-white"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>

          {isError && (
            <p className="text-red-500 text-sm text-center">{error?.message || "Login failed"}</p>
          )}
        </form>

        <div className="flex flex-col gap-2 mt-6 text-center">
          <p className="text-white text-lg">{"Don't have an account?"}</p>
          <Link to="/signup">
            <button className="btn rounded-full btn-primary text-white btn-outline w-full">
              Sign up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
