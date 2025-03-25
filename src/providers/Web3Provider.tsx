'use client';

import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react';
import { WagmiConfig } from 'wagmi';
import { mainnet, arbitrum } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

interface ErrorWithResponse {
  response?: {
    status?: number;
  };
}

// Validate project ID
const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;
if (!projectId) {
  throw new Error('NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID is not defined');
}

// Ensure projectId is treated as a string
const validatedProjectId: string = projectId;

const metadata = {
  name: 'Jackpot',
  description: 'Decentralized Lottery Application',
  url: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
  icons: ['/logo.svg'],
};

const chains = [mainnet, arbitrum] as const;

// Configure wagmi client
const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId: validatedProjectId,
  metadata,
  enableWalletConnect: true,
  enableInjected: true,
  enableEIP6963: true,
  enableCoinbase: true,
});

// Configure query client with retry logic
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        const err = error as ErrorWithResponse;
        if (err?.response?.status === 403) {
          return false;
        }
        return failureCount < 2;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initWeb3Modal = async () => {
      try {
        console.log('Initializing Web3Modal...');
        console.log('Project ID:', validatedProjectId);
        console.log('Chains:', chains.map(chain => chain.name));

        // Clear stale state
        localStorage.removeItem('wagmi.cache');
        localStorage.removeItem('wagmi.connected');
        localStorage.removeItem('wagmi.injected.connected');

        // Initialize Web3Modal
        await createWeb3Modal({
          wagmiConfig,
          projectId: validatedProjectId,
          defaultChain: mainnet,
          themeMode: 'dark',
          themeVariables: {
            '--w3m-font-family': 'Inter, sans-serif',
            '--w3m-accent': '#4F46E5',
          },
        });

        console.log('Web3Modal initialized successfully');
      } catch (error) {
        console.error('Failed to initialize Web3Modal:', error);
        // Log specific error details
        if (error instanceof Error) {
          console.error('Error message:', error.message);
          console.error('Error stack:', error.stack);
          setError(error.message);
        }
      }
    };

    initWeb3Modal();
    setMounted(true);
  }, []);

  // Prevent hydration issues
  if (!mounted) return null;

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded">
        <p>Failed to initialize Web3Modal: {error}</p>
      </div>
    );
  }

  return (
    <WagmiConfig config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiConfig>
  );
} 