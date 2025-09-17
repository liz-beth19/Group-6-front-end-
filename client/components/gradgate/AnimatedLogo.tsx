import { motion } from "framer-motion";

export function AnimatedLogo({ className = "h-16 w-16" }: { className?: string }) {
  return (
    <motion.img
      src="https://cdn.builder.io/api/v1/image/assets%2F7d31c179ca09481195e0fe9ffe5058f6%2Fc76d397d704c4839a0ba8969bc9c29dd?format=webp&width=160"
      alt="GradGate logo"
      className={className}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1, rotate: [0, 2, -2, 0] }}
      transition={{ duration: 1, rotate: { repeat: Infinity, duration: 10, ease: "easeInOut" } }}
    />
  );
}
