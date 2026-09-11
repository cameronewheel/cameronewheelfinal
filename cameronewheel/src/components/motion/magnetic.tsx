import { type ReactNode, useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { cn } from "@/lib/utils";

export function Magnetic({
  children,
  strength = 0.28,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const dx = useSpring(x, { stiffness: 260, damping: 20, mass: 0.35 });
  const dy = useSpring(y, { stiffness: 260, damping: 20, mass: 0.35 });

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      className={cn("inline-block will-change-transform", className)}
      style={{ x: dx, y: dy }}
      onPointerMove={(e) => {
        const box = ref.current?.getBoundingClientRect();
        if (!box) return;
        x.set((e.clientX - box.left - box.width / 2) * strength);
        y.set((e.clientY - box.top - box.height / 2) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}
