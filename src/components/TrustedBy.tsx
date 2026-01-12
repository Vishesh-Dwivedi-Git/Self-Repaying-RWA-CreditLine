import React from "react";

export const TrustedBy = () => {
    return (
        <div className="w-full bg-black/40 backdrop-blur-sm border-t border-white/5 py-8 md:py-10">
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 flex flex-col md:flex-row items-center gap-8 md:gap-16">

                {/* 1. Label */}
                <div className="flex-shrink-0 text-left md:pr-8 md:border-r md:border-white/10">
                    <p className="text-[10px] md:text-[11px] font-bold text-gray-500 tracking-[0.2em] leading-relaxed uppercase">
                        Trusted by Top<br />
                        Organizations
                    </p>
                </div>

                {/* 2. Logos Grid/Flex */}
                <div className="flex flex-wrap justify-center md:justify-start items-center gap-8 md:gap-12 opacity-80 mix-blend-screen w-full">

                    {/* MANTLE */}
                    <div className="flex items-center gap-2 group cursor-default">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white w-6 h-6">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="text-lg font-bold text-white tracking-wide">MANTLE</span>
                    </div>

                    {/* CENTRIFUGE */}
                    <div className="flex items-center gap-2 group cursor-default">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white w-6 h-6">
                            <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
                            <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="2" />
                        </svg>
                        <span className="text-lg font-bold text-white tracking-wide">CENTRIFUGE</span>
                    </div>

                    {/* GOLDFINCH */}
                    <div className="flex items-center gap-2 group cursor-default">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white w-6 h-6">
                            <path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z" stroke="currentColor" strokeWidth="2" />
                        </svg>
                        <span className="text-lg font-bold text-white tracking-wide">GOLDFINCH</span>
                    </div>

                    {/* BACKED */}
                    <div className="flex items-center gap-2 group cursor-default">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white w-6 h-6">
                            <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                            <path d="M9 3v18M15 3v18M3 9h18M3 15h18" stroke="currentColor" strokeWidth="1" opacity="0.5" />
                        </svg>
                        <span className="text-lg font-bold text-white tracking-wide">BACKED</span>
                    </div>

                    {/* CHAINLINK */}
                    <div className="flex items-center gap-2 group cursor-default">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white w-6 h-6">
                            <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="text-lg font-bold text-white tracking-wide">CHAINLINK</span>
                    </div>

                </div>
            </div>
        </div>
    );
};
