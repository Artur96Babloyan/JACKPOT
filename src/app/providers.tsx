'use client';

import { mainnet, sepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { Web3Modal } from '@web3modal/react';
import { createConfig } from 'wagmi';
import { http } from 'wagmi';
import { walletConnect } from 'wagmi/connectors';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '';

const metadata = {
  name: 'JACKPOT Lottery',
  description: 'Pick 5 numbers and try your luck!',
  url: 'https://jackpot-lottery.vercel.app',
  icons: ['https://jackpot-lottery.vercel.app/favicon.svg']
};

const chains = [mainnet, sepolia] as const;

const config = createConfig({
  chains,
  connectors: [
    walletConnect({
      projectId,
      metadata,
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Web3Modal
          projectId={projectId}
          // ethereumClient={config}
          themeMode="dark"
        />
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
} 