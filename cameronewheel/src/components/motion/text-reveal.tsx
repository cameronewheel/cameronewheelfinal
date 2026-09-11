import { motion, useReducedMotion } from "motion/react";

export function TextReveal({ lines }: { lines: string[] }) {
  const reduce = useReducedMotion();

  return (
    <>
      {lines.map((line, i) => (
        <span key={line} className="block overflow-hidden">
          <motion.span
            className="block"
            initial={reduce ? false : { y: "108%" }}
            animate={{ y: 0 }}
            transition={{
              duration: 0.72,
              delay: 0.06 + i * 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </>
  );
}
