"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import {
    Github,
    Linkedin,
    Twitter,
    Globe,
    Code2,
    Palette,
    Terminal,
    Cpu,
    Rocket,
    Layers,
    Database,
    Figma,
    ExternalLink,
    Plus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/Navbar";

// --- TYPES ---
interface DeveloperProps {
    name: string;
    role: string;
    image: string;
    bio: string;
    stack: string[];
    socials: {
        twitter?: string;
        linkedin?: string;
        github?: string;
        portfolio?: string;
    };
    icon: any;
}

// --- DATA ---
const TEAM_DATA: DeveloperProps[] = [
    {
        name: "Aditya",
        role: "Frontend Architect & Designer",
        image: "/images/team/aditya.jpg",
        bio: "Master of visual hierarchy and motion. Blending code with art to create fluid, avant-garde digital experiences.",
        stack: ["React", "Next.js", "GSAP", "Lenis", "Framer Motion", "Anime.js", "Tailwind", "TypeScript", "Wagmi", "After Effects"],
        socials: {
            twitter: "https://x.com/Motion_Viz",
            linkedin: "https://www.linkedin.com/in/adityak777/",
            portfolio: "https://www.itsadi.me/"
        },
        icon: Palette,
    },
    {
        name: "Vishesh Diwedi",
        role: "Smart Contract Engineer",
        image: "/images/team/vishesh.jpg",
        bio: "Architecting secure, gas-optimized protocols. Integrating complex chain interactions with seamless full-stack experiences.",
        stack: ["Solidity", "Next.js", "PostgreSQL", "Hardhat", "Foundry", "Wagmi"],
        socials: {
            portfolio: "https://visheshbuilds.vercel.app/",
            twitter: "https://x.com/Vishesh2Dwivedi",
            linkedin: "https://www.linkedin.com/in/vishesh-dwivedi-567426275/"
        },
        icon: Code2,
    },
    {
        name: "Ayush",
        role: "DeFi Developer",
        image: "/images/team/ayush.jpg",
        bio: "Specializing in decentralized finance protocols and smart contract integration. Building robust financial primitives.",
        stack: ["Solidity", "TypeScript", "Ethers.js", "Hardhat"],
        socials: {
            twitter: "#",
            github: "#",
            linkedin: "#"
        },
        icon: Code2,
    },
    {
        name: "Nilam",
        role: "Cloud Developer",
        image: "/images/team/google_cloud.png",
        bio: "Architecting scalable cloud infrastructure and ensuring high availability for mission-critical applications.",
        stack: ["Google Cloud", "AWS", "Docker", "Kubernetes", "Node.js"],
        socials: {
            github: "#",
            linkedin: "https://www.linkedin.com/in/nilam-bhojwani-91105628b/"
        },
        icon: Database,
    }
];

// --- COMPONENTS ---

// Developer Card with Odyssée Style
const DeveloperCard = ({ dev, index }: { dev: DeveloperProps, index: number }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        cardRef.current.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        cardRef.current.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    };

    return (
        <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            className={cn(
                "group relative w-full h-full min-h-[500px] rounded-[2rem] bg-[#080808] border overflow-hidden transition-all duration-300",
                isHovered ? "border-[#C3F53C]/30 shadow-[0_20px_60px_rgba(195,245,60,0.1)]" : "border-white/5 hover:border-white/10"
            )}
        >
            {/* Spotlight Effect */}
            <div
                className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(195,245,60,0.12), transparent 40%)`,
                }}
            />

            {/* Content Container */}
            <div className="relative h-full flex flex-col p-8 z-10">

                {/* Header: Role Icon & Links */}
                <div className="flex justify-between items-start mb-8">
                    <div className={cn(
                        "p-3 rounded-2xl border backdrop-blur-md transition-all duration-300",
                        isHovered ? "bg-[#C3F53C]/10 border-[#C3F53C]/30 text-[#C3F53C]" : "bg-white/5 border-white/10 text-white/60"
                    )}>
                        <dev.icon className="w-6 h-6" />
                    </div>
                    <div className="flex gap-2">
                        {dev.socials.portfolio && (
                            <a href={dev.socials.portfolio} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-white/5 hover:bg-[#C3F53C]/10 text-gray-400 hover:text-[#C3F53C] transition-all transform hover:-translate-y-1">
                                <Globe className="w-4 h-4" />
                            </a>
                        )}
                        {dev.socials.twitter && (
                            <a href={dev.socials.twitter} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-white/5 hover:bg-[#C3F53C]/10 text-gray-400 hover:text-[#C3F53C] transition-all transform hover:-translate-y-1">
                                <Twitter className="w-4 h-4" />
                            </a>
                        )}
                        {dev.socials.linkedin && (
                            <a href={dev.socials.linkedin} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-white/5 hover:bg-[#C3F53C]/10 text-gray-400 hover:text-[#C3F53C] transition-all transform hover:-translate-y-1">
                                <Linkedin className="w-4 h-4" />
                            </a>
                        )}
                    </div>
                </div>

                {/* Profile Image */}
                <div className="relative w-32 h-32 mb-6 mx-auto group-hover:scale-105 transition-transform duration-500">
                    <div className={cn("absolute inset-0 rounded-full blur-2xl transition-opacity duration-500", isHovered ? "opacity-60 bg-[#C3F53C]" : "opacity-20 bg-[#C3F53C]")} />
                    <Image
                        src={dev.image}
                        alt={dev.name}
                        fill
                        className={cn("rounded-full object-cover border-2 relative z-10 transition-colors duration-300", isHovered ? "border-[#C3F53C]/50" : "border-white/10")}
                    />
                </div>

                {/* Info */}
                <div className="text-center mb-6">
                    <h3 className={cn("text-2xl font-display font-bold mb-2 tracking-tight transition-colors duration-300", isHovered ? "text-[#C3F53C]" : "text-white")}>{dev.name}</h3>
                    <div className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white/5 border border-white/5 text-gray-300">
                        {dev.role}
                    </div>
                </div>

                <p className="text-sm text-gray-400 text-center leading-relaxed mb-8 flex-grow font-sans">
                    {dev.bio}
                </p>

                {/* Tech Stack */}
                <div className="mt-auto">
                    <div className="flex flex-wrap justify-center gap-2">
                        {dev.stack.map((tech, i) => (
                            <span
                                key={i}
                                className={cn(
                                    "px-2.5 py-1 rounded-md border text-[10px] font-mono transition-colors cursor-default",
                                    isHovered ? "bg-[#C3F53C]/5 border-[#C3F53C]/20 text-[#C3F53C]/80 hover:bg-[#C3F53C]/10" : "bg-white/[0.03] border-white/[0.05] text-gray-500 hover:text-white hover:border-white/20"
                                )}
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>

            </div>
        </motion.div>
    );
};


export default function DevelopersPage() {
    return (
        <div className="min-h-screen bg-[#050505] selection:bg-[#C3F53C]/30 relative overflow-hidden">
            <Navbar />

            {/* Background Ambience */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none z-0" />
            <div className="fixed top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#C3F53C]/5 to-transparent blur-[120px] pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-24">

                {/* Header Section */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C3F53C]/10 border border-[#C3F53C]/20 text-[#C3F53C] text-xs font-bold tracking-widest uppercase mb-6"
                    >
                        <Terminal className="w-3 h-3" /> The Builders
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-5xl md:text-7xl font-display font-medium text-white tracking-tighter mb-6"
                    >
                        Architects of the <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C3F53C] via-white to-gray-600">Digital Frontier</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg text-gray-400 font-sans leading-relaxed"
                    >
                        We are a collective of designers, engineers, and strategists obsessed with perfection.
                        Building the infrastructure for the next generation of finance.
                    </motion.p>
                </div>

                {/* Team Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {TEAM_DATA.map((dev, i) => (
                        <DeveloperCard key={i} dev={dev} index={i} />
                    ))}

                    {/* Join Us Card */}
                    <motion.a
                        href="https://x.com/Motion_Viz"
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.02, y: -5 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="group relative min-h-[500px] rounded-[2rem] border border-dashed border-white/10 flex flex-col items-center justify-center text-center p-8 hover:bg-[#C3F53C]/5 hover:border-[#C3F53C]/30 transition-all cursor-pointer block"
                    >
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-gray-500 mb-6 group-hover:scale-110 group-hover:bg-[#C3F53C]/10 group-hover:text-[#C3F53C] transition-all duration-300">
                            <Plus className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-display font-medium text-white mb-2 group-hover:text-[#C3F53C] transition-colors">Join the Collective</h3>
                        <p className="text-sm text-gray-500 max-w-xs mx-auto mb-8">
                            We are always looking for exceptional talent. If you are obsessed with quality, we want to hear from you.
                        </p>
                        <span
                            className="px-6 py-3 rounded-full bg-[#C3F53C] text-black font-bold text-sm hover:bg-[#d4ff5c] transition-colors flex items-center gap-2 shadow-[0_0_30px_rgba(195,245,60,0.3)] inline-flex"
                        >
                            View Openings <ExternalLink className="w-4 h-4" />
                        </span>
                    </motion.a>
                </div>

            </div>
        </div>
    );
}
