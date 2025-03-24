'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Web3ModalProvider } from '@/components/providers/Web3ModalProvider';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Web3ModalProvider>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </Web3ModalProvider>
  );
} 