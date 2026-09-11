import type { PointerEvent } from "react";

export function spotHandlers() {
  return {
    onPointerMove: (e: PointerEvent<HTMLElement>) => {
      const box = e.currentTarget.getBoundingClientRect();
      e.currentTarget.style.setProperty("--spot-x", `${e.clientX - box.left}px`);
      e.currentTarget.style.setProperty("--spot-y", `${e.clientY - box.top}px`);
    },
  };
}
