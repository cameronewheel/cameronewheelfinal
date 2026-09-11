import { type ReactNode, useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { cn } from "@/lib/utils";

export function Tilt({
  children,
  className,
  max = 7,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 180, damping: 18, mass: 0.4 });
  const sy = useSpring(py, { stiffness: 180, damping: 18, mass: 0.4 });
  const rotateX = useTransform(sy, [-0.5, 0.5], [max, -max]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-max, max]);
  const glareX = useTransform(sx, [-0.5, 0.5], ["12%", "88%"]);
  const glareY = useTransform(sy, [-0.5, 0.5], ["12%", "88%"]);
  const glare = useMotionTemplate`radial-gradient(220px circle at ${glareX} ${glareY}, color-mix(in oklab, white 30%, transparent), transparent 58%)`;

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      className={cn("tilt-shell", className)}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onPointerMove={(e) => {
        const box = ref.current?.getBoundingClientRect();
        if (!box) return;
        px.set((e.clientX - box.left) / box.width - 0.5);
        py.set((e.clientY - box.top) / box.height - 0.5);
      }}
      onPointerLeave={() => {
        px.set(0);
        py.set(0);
      }}
    >
      {children}
      <motion.span className="tilt-glare" aria-hidden style={{ background: glare }} />
    </motion.div>
  );
}
