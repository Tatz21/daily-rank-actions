import { useState, useRef, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, PanInfo, useAnimation } from "framer-motion";

const SWIPE_PAGES = [
  "/dashboard",
  "/dashboard/audit",
  "/dashboard/keywords",
  "/dashboard/rank-tracker",
  "/dashboard/competitors",
  "/dashboard/ai-assistant",
  "/dashboard/meta-tags",
  "/dashboard/backlinks",
  "/dashboard/content-score",
  "/dashboard/sitemap",
  "/dashboard/settings",
];

const SWIPE_THRESHOLD = 50;

export default function SwipeablePages({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const controls = useAnimation();
  const currentIndex = SWIPE_PAGES.indexOf(location.pathname);

  const handleDragEnd = (_: any, info: PanInfo) => {
    const { offset, velocity } = info;

    if (Math.abs(offset.x) > SWIPE_THRESHOLD || Math.abs(velocity.x) > 300) {
      if (offset.x > 0 && currentIndex > 0) {
        // Swipe right → go to previous page
        navigate(SWIPE_PAGES[currentIndex - 1]);
      } else if (offset.x < 0 && currentIndex < SWIPE_PAGES.length - 1) {
        // Swipe left → go to next page
        navigate(SWIPE_PAGES[currentIndex + 1]);
      }
    }

    controls.start({ x: 0, transition: { duration: 0.2 } });
  };

  // Only enable swipe on recognized pages
  if (currentIndex === -1) return <>{children}</>;

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.15}
      onDragEnd={handleDragEnd}
      animate={controls}
      className="touch-pan-y"
      style={{ cursor: "grab" }}
    >
      {children}
    </motion.div>
  );
}
