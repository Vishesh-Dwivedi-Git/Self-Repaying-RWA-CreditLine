"use client";

import { useEffect } from "react";

export function ServiceWorkerCleaner() {
    useEffect(() => {
        if (typeof window !== "undefined" && "serviceWorker" in navigator) {
            navigator.serviceWorker.getRegistrations().then((registrations) => {
                for (const registration of registrations) {
                    console.warn("Unregistering zombie service worker:", registration);
                    registration.unregister();
                }
            });
        }
    }, []);

    return null;
}
