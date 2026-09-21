import React from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full max-w-[400px] mx-auto text-[#dbdee1]">
      {/* Header Text */}
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-white mb-1">Welcome back!</h2>
        <p className="text-sm text-[#949ba4]">
          We're so excited to see you again!
        </p>
      </div>

      <div className="space-y-1">
        {/* Email or Phone Number Field */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#949ba4] mb-1">
            Email or Phone Number <span className="text-[#f23f43]">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter your email or phone"
            className="w-full bg-[#1e1f22] text-[#dbdee1] px-3 py-2 outline-none border border-gray-800 focus:border-[#5865f2] text-sm rounded-lg"
          />
          <p className="text-[#f23f43] text-[10px] mt-0.5 h-3">
            {/* Email/Phone error message */}
          </p>
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#949ba4] mb-1">
            Password <span className="text-[#f23f43]">*</span>
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full bg-[#1e1f22] text-[#dbdee1] px-3 py-2 outline-none border border-gray-800 focus:border-[#5865f2] text-sm rounded-lg"
          />
          <p className="text-[#f23f43] text-[10px] mt-0.5 h-3">
            {/* Password error message */}
          </p>

          {/* Forgot Password Link */}
          <div className="flex justify-end items-center mt-1">
            <span className="text-xs text-[#00a8fc] hover:underline cursor-pointer">
              Forgot your password?
            </span>
          </div>
        </div>

        {/* Log In Submit Button */}
        <button
          type="button"
          className="w-full bg-[#5865f2] hover:bg-[#4752c4] text-white font-medium py-2.5 rounded-lg transition text-sm shadow-md mt-2"
        >
          Log In
        </button>

        {/* Divider for Google Login */}
        <div className="flex items-center my-3">
          <div className="flex-grow border-t border-[#2e3445]"></div>
          <span className="px-3 text-xs text-[#949ba4] uppercase">or</span>
          <div className="flex-grow border-t border-[#2e3445]"></div>
        </div>

        {/* Google Login Button */}
        <button
          type="button"
          className="w-full bg-[#2b2d31] hover:bg-[#35363c] text-white font-medium py-2.5 rounded-lg transition text-sm flex items-center justify-center gap-3 border border-[#35363c]"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.1 8.9 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
            />
            <path
              fill="#FBBC05"
              d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.7s.2-2 .4-2.7L1.6 6.4C.6 8.4 0 10.6 0 13s.6 4.6 1.6 6.6l3.7-2.9z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.1-6.7-5.3L1.6 15.6C3.5 19.4 7.4 23 12 23z"
            />
          </svg>
          Sign in with Google
        </button>

        <div className="text-xs text-[#949ba4] pt-2">
          Need an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-[#00a8fc] hover:underline"
          >
            Register
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
