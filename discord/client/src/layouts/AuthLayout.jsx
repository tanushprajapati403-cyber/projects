import AuthChatPreview from "../components/AuthChatPreview";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <>
      <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center p-4">
        {/* Main Split Card Box */}
        <div className="w-[1200px] h-[600px] bg-bg-[#12141c] rounded-2xl shadow-2xl flex overflow-hidden border border-[#2b2d31]">
          {/* Left Side: Hearth Branding & Chat Preview */}
          <div className="w-1/2 p-10 flex flex-col justify-between bg-gradient-to-b from-[#1e1f22] to-[#18191c]">
            <div>
              {/* Logo */}
              <div className="flex items-center text-white font-bold text-xl mb-8">
                <span className="text-[30px]">
                  Nex<span className="text-orange-500">Cord</span>
                </span>
                <span className="text-[30px]">⚡</span>
              </div>

              {/* Heading */}
              <h1 className="text-4xl font-extrabold text-[#00ffcc] leading-tight mb-4">
                Your people,{" "}
                <span className="text-green-500">already talking.</span>
              </h1>
              <p className="text-[#949ba4] text-sm mb-8 leading-relaxed">
                Voice, text and threads for the servers you actually keep coming
                back to. No noise, no nags.
              </p>

              {/* Mock Chat Box Preview */}
              <AuthChatPreview />
            </div>
          </div>

          {/* Right Side: Dynamic Auth Form Area */}
          <div className="w-1/2 p-10 flex flex-col justify-center bg-[#161922] relative">
            {/* Light/Dark Toggle Mock Button */}
            <div className="absolute top-6 right-6">
              <button className="text-xs bg-[#2b2d31] text-[#dbdee1] px-3 py-1.5 rounded-md hover:bg-[#35363c] transition">
                Light
              </button>
            </div>

            {/* Outlet will load Login.jsx or Register.jsx dynamically */}
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthLayout;
