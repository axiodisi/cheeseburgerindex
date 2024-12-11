"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import React from "react";

const KetchupBottle = () => {
  const { scrollYProgress } = useScroll();
  const x = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ["-100%", "150%", "300%"]
  );
  const rotate = useTransform(scrollYProgress, [0, 0.5, 1], [0, 360, 720]);

  return (
    <motion.div
      className="fixed top-1/2 -translate-y-1/2 w-24 h-24 md:w-32 md:h-32 z-50 pointer-events-none"
      style={{ x, rotate }}
    >
      <span className="text-6xl md:text-7xl">🍅</span>
    </motion.div>
  );
};

export default KetchupBottle;
