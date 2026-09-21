import React from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
   const navigate = useNavigate()
  return (
    <>
      <div className="w-full max-w-[400px] mx-auto text-[#dbdee1]">
        {/* Header Text */}
        <div className="text-center mb-2">
          <h2 className="text-xl font-bold text-white">Create an account</h2>
        </div>

        <div className="space-y-1">
          {/* Email Field */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#949ba4] mb-0.5">
              Email <span className="text-[#f23f43]">*</span>
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full bg-[#1e1f22] text-[#dbdee1] px-3 py-1.5 outline-none border border-gray-800 focus:border-[#5865f2] text-xs rounded-md"
            />
            <p className="text-[#f23f43] text-[10px] h-3">
              {/* Email error */}
            </p>
          </div>

          {/* Display Name Field */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#949ba4] mb-0.5">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full bg-[#1e1f22] text-[#dbdee1] px-3 py-1.5 outline-none border border-gray-800 focus:border-[#5865f2] text-xs rounded-md"
            />
            <p className="text-[#f23f43] text-[10px] h-3">
              {/* Full Name error */}
            </p>
          </div>

          {/* Username Field */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#949ba4] mb-0.5">
              Username <span className="text-[#f23f43]">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. rahul_123"
              className="w-full bg-[#1e1f22] text-[#dbdee1] px-3 py-1.5 outline-none border border-gray-800 focus:border-[#5865f2] text-xs rounded-md"
            />
            <p className="text-[#f23f43] text-[10px] h-3">
              {/* Username error */}
            </p>
          </div>

          {/* Mobile No. */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#949ba4] mb-0.5">
              Mobile Number <span className="text-[#f23f43]">*</span>
            </label>
            <input
              type="tel"
              maxLength={10}
              placeholder="Enter mobile number"
              className="w-full bg-[#1e1f22] text-[#dbdee1] px-3 py-1.5 outline-none border border-gray-800 focus:border-[#5865f2] text-xs rounded-md"
            />
            <p className="text-[#f23f43] text-[10px] h-3">
              {/* Mobile error */}
            </p>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#949ba4] mb-0.5">
              Password <span className="text-[#f23f43]">*</span>
            </label>
            <input
              type="password"
              placeholder="At least 6 characters"
              className="w-full bg-[#1e1f22] text-[#dbdee1] px-3 py-1.5 outline-none border border-gray-800 focus:border-[#5865f2] text-xs rounded-md"
            />
            <p className="text-[#f23f43] text-[10px] h-3">
              {/* Password error */}
            </p>
          </div>

          {/* Date of Birth Fields */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#949ba4] mb-0.5">
              Date of Birth <span className="text-[#f23f43]">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <select className="w-full bg-[#1e1f22] text-[#949ba4] px-2 py-1.5 outline-none border border-gray-800 focus:border-[#5865f2] text-xs rounded-md">
                <option>Month</option>
              </select>
              <select className="w-full bg-[#1e1f22] text-[#949ba4] px-2 py-1.5 outline-none border border-gray-800 focus:border-[#5865f2] text-xs rounded-md">
                <option>Day</option>
              </select>
              <select className="w-full bg-[#1e1f22] text-[#949ba4] px-2 py-1.5 outline-none border border-gray-800 focus:border-[#5865f2] text-xs rounded-md">
                <option>Year</option>
              </select>
            </div>
            <p className="text-[#f23f43] text-[10px] h-3">{/* DOB error */}</p>
          </div>

          {/* Create Account Button */}
          <button
            type="button"
            className="w-full bg-[#5865f2] hover:bg-[#4752c4] text-white font-medium py-2 rounded-md transition text-xs shadow-md"
          >
            Create Account
          </button>

          <div className="text-[11px] text-[#949ba4] pt-0.5">
            <span className="text-[#00a8fc]">
              <span>Already have an account?</span>{" "}
              <span
                onClick={() => navigate("/login")}
                className="hover:underline"
              >
                Log in
              </span>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
