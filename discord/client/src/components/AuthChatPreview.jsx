import React, { useEffect, useRef } from "react";
import { animateauthChatItems } from "../animations/authAnimations";

const AuthChatPreview = () => {
  const chatContainerRef = useRef(null);

  useEffect(() => {
    animateauthChatItems(chatContainerRef.current);
  }, []);
  return (
    <>
      <div
        ref={chatContainerRef}
        className="p-4 rounded-xl space-y-3 "
      >
        <div className="text-xs text-[#949ba4] font-semibold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#23a55a]"></span>
          #late-night · <span className="text-[#23a55a]">4 online</span>
        </div>

        {/* Chat Item 1 */}
        <div className="chat-item bg-[#1e1f22] p-2.5 rounded-lg flex items-start gap-3">
          <div className="chat-item w-8 h-8 rounded-full bg-[#5865f2] text-white flex items-center justify-center font-bold text-xs shrink-0">
            R
          </div>
          <div>
            <div className="chat-item text-xs font-bold text-white">Riya </div>
            <div className="chat-item text-xs text-[#dbdee1]">
              stream starts in 10, who is in
            </div>
          </div>
        </div>

        {/* Chat Item 2 */}
        <div className="chat-item bg-[#1e1f22] p-2.5 rounded-lg flex items-start gap-3">
          <div className="chat-item w-8 h-8 rounded-full bg-blue-200 text-white flex items-center justify-center font-bold text-xs shrink-0">
            T
          </div>
          <div>
            <div className="chat-item text-xs font-bold text-white">Tanu</div>
            <div className="chat-item text-xs text-[#dbdee1]">
              me. pushing one fix first
            </div>
          </div>
        </div>

        <div className="chat-item bg-[#1e1f22] p-2.5 rounded-lg flex items-start gap-3">
          <div className="chat-item w-8 h-8 rounded-full bg-red-300 text-white flex items-center justify-center font-bold text-xs shrink-0">
            K
          </div>
          <div>
            <div className="chat-item text-xs font-bold text-white">Kabir</div>
            <div className="chat-item text-xs text-[#dbdee1]">joined voice</div>
          </div>
        </div>

        <div className="chat-item bg-[#1e1f22] p-2.5 rounded-lg flex items-start gap-3">
          <div className="chat-item w-8 h-8 rounded-full bg-[#5865f2] text-white flex items-center justify-center font-bold text-xs shrink-0">
            R
          </div>
          <div>
            <div className="chat-item text-xs font-bold text-white">Riya</div>
            <div className="chat-item text-xs text-[#dbdee1]">
              bring the good mic this time
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthChatPreview;
