"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface PremiumButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    className?: string;
}

export const PremiumButton = ({ children, className, onClick, ...props }: PremiumButtonProps) => {
    const ref = useRef<HTMLButtonElement>(null);

    // Mouse position for spotlight
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Magnetic pull values
    const pullX = useMotionValue(0);
    const pullY = useMotionValue(0);

    // Smooth spring physics for the magnetic effect
    const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
    const springX = useSpring(pullX, springConfig);
    const springY = useSpring(pullY, springConfig);

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Calculate distance from center for magnetic pull
        const distanceX = e.clientX - centerX;
        const distanceY = e.clientY - centerY;

        // Update spotlight position relative to button
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);

        // Apply magnetic pull (capped at modest range so it doesn't fly away)
        pullX.set(distanceX * 0.2);
        pullY.set(distanceY * 0.2);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
        pullX.set(0);
        pullY.set(0);
    };

    return (
        <motion.button
            ref={ref}
            className={cn(
                "relative flex items-center justify-center overflow-hidden rounded-full group",
                "bg-[#0A0A0A] text-white font-medium tracking-wide text-lg",
                "border border-white/10 hover:border-[#C3F53C]/50",
                "shadow-[0_0_20px_rgba(0,0,0,0.5)]",
                "hover:shadow-[0_0_30px_rgba(195,245,60,0.15),inset_0_0_20px_rgba(195,245,60,0.05)]",
                "transition-all duration-500",
                className
            )}
            style={{
                x: springX,
                y: springY,
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            {...props as any}
        >
            {/* Spotlight Gradient Layer - Lime */}
            <motion.div
                className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
                        radial-gradient(
                          250px circle at ${mouseX}px ${mouseY}px,
                          rgba(195, 245, 60, 0.15),
                          transparent 80%
                        )
                    `,
                }}
            />

            {/* Glass Reflection / Sheen */}
            <div className="absolute inset-0 rounded-full ring-1 ring-white/10 group-hover:ring-[#C3F53C]/30 transition-all duration-500" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1/2 bg-gradient-to-b from-white/10 to-transparent opacity-30 blur-sm pointer-events-none" />

            {/* Content Layer */}
            <span className="relative z-10 flex items-center gap-2 group-hover:text-[#C3F53C] transition-colors duration-300">
                {children}
            </span>
        </motion.button>
    );
};
