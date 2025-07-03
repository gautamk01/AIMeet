import React, { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";

interface BouncingLoadingProps {
  dotCount?: number;
  size?: number;
  bounceHeight?: number;
  color?: string;
  duration?: number;
}

export const BouncingLoading: React.FC<BouncingLoadingProps> = ({
  dotCount = 3,
  size = 16,
  bounceHeight = 20,
  color = "#22c55e",
  duration = 0.6,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1 });

      // Bouncing animation with stagger
      tl.to(".bounce-dot", {
        y: -bounceHeight,
        duration: duration / 2,
        ease: "power2.out",
        stagger: 0.1,
      }).to(".bounce-dot", {
        y: 0,
        duration: duration / 2,
        ease: "bounce.out",
        stagger: 0.1,
      });
    }, containerRef);

    return () => ctx.revert();
  }, [bounceHeight, duration]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div ref={containerRef} className="flex items-end space-x-2">
        {Array.from({ length: dotCount }, (_, i) => (
          <div
            key={i}
            className="bounce-dot"
            style={{
              width: size,
              height: size,
              backgroundColor: color,
              borderRadius: "50%",
            }}
          />
        ))}
      </div>
    </div>
  );
};
