import { useState, useEffect } from 'react';

interface KeeperStatus {
    lastScanTime: string | null;
    nextScanTime: string | null;
    secondsUntilNextScan: number;
    scanInterval: number;
    isScanning: boolean;
}

const KEEPER_API_URL = process.env.NEXT_PUBLIC_KEEPER_API_URL || 'http://localhost:3001';

export function useKeeperStatus() {
    const [status, setStatus] = useState<KeeperStatus | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        const fetchStatus = async () => {
            try {
                const response = await fetch(`${KEEPER_API_URL}/api/status`);
                if (!response.ok) {
                    throw new Error('Failed to fetch keeper status');
                }
                const data = await response.json();
                setStatus(data);
                setError(null);
                setIsLoading(false);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
                setIsLoading(false);
            }
        };

        // Fetch immediately
        fetchStatus();

        // Then fetch every 5 seconds
        intervalId = setInterval(fetchStatus, 5000);

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, []);

    return {
        status,
        isLoading,
        error,
        secondsUntilNextScan: status?.secondsUntilNextScan ?? 0,
        isScanning: status?.isScanning ?? false,
    };
}
