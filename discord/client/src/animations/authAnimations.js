import gsap from "gsap";

export const animateauthChatItems = (containerRef) => {
  if (!containerRef) return;

  const messages = containerRef.querySelectorAll(".chat-item");

  gsap.fromTo(
    messages,
    { opacity: 0, y: 20, scale: 0.95 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.5,
      stagger: 0.5,
      ease: "power2.out",
      delay: 0.4,
    },
  );
};
