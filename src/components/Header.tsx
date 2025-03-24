'use client';

import { WalletConnect } from '@/components/WalletConnect'
import Image from 'next/image'
import { useAccount } from 'wagmi'
import { useBalance } from '@/hooks/useBalance'

export function Header() {
  const { balance } = useBalance()
  const { address } = useAccount()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-indigo-950/30 backdrop-blur-xl">
      <div className="flex items-center gap-2">
        <Image
          src="/logo.svg"
          alt="JACKPOT"
          width={32}
          height={32}
          className="w-8 h-8"
        />
        <span className="text-xl font-bold text-white">JACKPOT</span>
      </div>
      
      <div className="flex items-center gap-4">
        {address && balance && (
          <div className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-full">
            {balance}
          </div>
        )}
        <WalletConnect />
      </div>
    </header>
  )
} 