import { http, createConfig } from 'wagmi'
import { mainnet, sepolia, mantle, mantleSepoliaTestnet } from 'wagmi/chains'
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors'

// WalletConnect Project ID - Get one at https://cloud.walletconnect.com
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo-project-id'

export const config = createConfig({
    chains: [mantle, mantleSepoliaTestnet, mainnet, sepolia],
    connectors: [
        injected(),
        walletConnect({ projectId }),
        coinbaseWallet({ appName: 'Odyssée RWA' }),
    ],
    transports: {
        [mantle.id]: http(),
        [mantleSepoliaTestnet.id]: http(),
        [mainnet.id]: http(),
        [sepolia.id]: http(),
    },
})
