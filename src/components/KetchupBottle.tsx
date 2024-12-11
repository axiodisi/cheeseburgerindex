"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import React from "react";

const KetchupBottle = () => {
  const [isMobile, setIsMobile] = React.useState(true);
  const { scrollYProgress } = useScroll();
  const x = useTransform(
    scrollYProgress,
    [0, 0.3, 0.6],
    ["-100%", "150%", "300%"]
  );
  const rotate = useTransform(scrollYProgress, [0, 0.3, 0.6], [0, 360, 720]);

  React.useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isMobile) {
    return (
      <motion.div
        className="fixed top-1/2 -translate-y-1/2 w-24 h-24 z-50 pointer-events-none"
        style={{ x, rotate }}
      >
        <span className="text-6xl">🍅</span>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="fixed bottom-12 w-24 h-24 z-50 pointer-events-none"
      animate={{
        x: ["-10vw", "110vw"],
        y: [0, -20, 0, -20, 0, -20, 0],
        rotate: [0, 360],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        repeatDelay: 0.5,
        ease: "linear",
        y: {
          duration: 2,
          repeat: 3,
          ease: "easeInOut",
        },
      }}
    >
      <span className="text-6xl">🍅</span>
    </motion.div>
  );
};

export default KetchupBottle;
