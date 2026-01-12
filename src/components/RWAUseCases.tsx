"use client";

import React from "react";

export default function RWAUseCases() {
    return (
        <section className="py-20 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Placeholder Cards */}
                {["Real Estate", "Invoices", "Commodities"].map((useCase) => (
                    <div
                        key={useCase}
                        className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300"
                    >
                        <h3 className="text-xl font-semibold text-white mb-2">{useCase}</h3>
                        <p className="text-gray-400 text-sm">
                            Tokenize and leverage your {useCase.toLowerCase()} as collateral.
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
