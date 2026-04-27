import { http, createConfig, createStorage } from 'wagmi';
import { base, mainnet } from 'wagmi/chains';
import { baseAccount, injected } from 'wagmi/connectors';

export const wagmiConfig = createConfig({
  chains: [base, mainnet],
  connectors: [
    injected(),                          // MetaMask, Rabby, any browser wallet
    baseAccount({ appName: 'The Glitch' }), // Base Account (passkey, no seed phrase)
  ],
  storage: createStorage({ storage: localStorage }), // Simple localStorage for Vite SPA
  ssr: false,
  transports: {
    [base.id]: http(),                   // Public Base mainnet RPC
    [mainnet.id]: http(),                // Public Ethereum mainnet RPC (for ENS/Basenames)
  },
});

declare module 'wagmi' {
  interface Register {
    config: typeof wagmiConfig;
  }
}
