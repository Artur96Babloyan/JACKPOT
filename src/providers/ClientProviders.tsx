'use client';

import { Web3Provider } from '@/providers/Web3Provider';
import { TelegramViewport } from '@/components/TelegramViewport';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <Web3Provider>
      <TelegramViewport />
      {children}
    </Web3Provider>
  );
} 