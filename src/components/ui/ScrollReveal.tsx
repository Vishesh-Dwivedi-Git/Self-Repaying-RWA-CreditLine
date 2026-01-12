"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface ScrollRevealProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    duration?: number;
    width?: "fit-content" | "100%";
}

export function ScrollReveal({
    children,
    className,
    delay = 0,
    duration = 0.8,
    width = "100%"
}: ScrollRevealProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
                duration,
                delay,
                ease: [0.22, 1, 0.36, 1] // Custom cubic-bezier for "heavy" feel
            }}
            style={{ width }}
            className={cn(className)}
        >
            {children}
        </motion.div>
    );
}
