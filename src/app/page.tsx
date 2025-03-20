'use client';

import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi';
import { formatEther } from 'viem';
import { metaMask } from 'wagmi/connectors';

interface Ticket {
  id: string;
  numbers: number[];
  status: 'pending' | 'won' | 'lost';
  drawNumber: string;
}

export default function Home() {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [transferAmount, setTransferAmount] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [betError, setBetError] = useState<string | null>(null);
  const BET_AMOUNT = 1.5; // USDT
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: '1',
      numbers: [1, 15, 23, 34, 45],
      status: 'pending',
      drawNumber: '#1234'
    },
    {
      id: '2',
      numbers: [7, 12, 28, 39, 42],
      status: 'won',
      drawNumber: '#1233'
    }
  ]);

  const { address, isConnected } = useAccount();
  const { connect, isPending: isConnecting } = useConnect({
    mutation: {
      onError(error) {
        setConnectionError(error.message);
        console.error('Connection error:', error);
      },
      onSuccess() {
        setConnectionError(null);
        console.log('Wallet connected successfully');
      }
    }
  });
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({
    address: address,
  });

  const handleNumberSelect = (number: number) => {
    if (selectedNumbers.includes(number)) {
      setSelectedNumbers(selectedNumbers.filter((n) => n !== number));
    } else if (selectedNumbers.length === 0) {
      // If this is the first number being selected, start fresh
      setSelectedNumbers([number]);
    } else if (selectedNumbers.length < 5) {
      // If we already have some numbers, add the new one
      setSelectedNumbers([...selectedNumbers, number]);
    }
  };

  const handleQuickPick = () => {
    // Generate 5 unique random numbers
    const numbers = new Set<number>();
    while (numbers.size < 5) {
      const randomNum = Math.floor(Math.random() * 50) + 1;
      numbers.add(randomNum);
    }
    
    // Convert to sorted array
    const selectedNums = Array.from(numbers).sort((a, b) => a - b);
    
    // Update state with new numbers
    setSelectedNumbers(selectedNums);
  };

  // Update useEffect to be more detailed
  useEffect(() => {
    // Monitor state changes without logging
  }, [selectedNumbers, isConnected]);

  // Add useEffect to monitor connection state
  useEffect(() => {
    // Monitor connection state without logging
  }, [isConnected, address]);

  const handleClearSelection = () => {
    setSelectedNumbers([]);
  };

  const handleConnectWallet = () => {
    connect({ connector: metaMask() });
  };

  const handleTransfer = () => {
    // Transfer logic would go here
    setShowTransferModal(false);
    setTransferAmount('');
    setRecipientAddress('');
  };

  const handlePlaceBet = () => {
    if (selectedNumbers.length === 5) {
      const currentBalance = balance ? Number(formatEther(balance.value)) : 0;
      
      if (currentBalance < BET_AMOUNT) {
        setBetError('Insufficient balance. Please add funds to place a bet.');
        setShowDepositModal(true);
        return;
      }

      const newTicket: Ticket = {
        id: (tickets.length + 1).toString(),
        numbers: [...selectedNumbers].sort((a, b) => a - b),
        status: 'pending',
        drawNumber: `#${Math.floor(Math.random() * 10000)}`
      };
      setTickets([newTicket, ...tickets]);
      setSelectedNumbers([]);
      setBetError(null);
    }
  };

  const handleDeposit = () => {
    // Here you would typically integrate with your payment gateway or smart contract
    // For now, we'll just close the modal
    setShowDepositModal(false);
    setDepositAmount('');
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white p-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <h1 className="text-5xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
          JACKPOT
        </h1>
        <p className="text-center text-gray-300 text-lg">Pick 5 numbers and try your luck!</p>
      </div>

      {/* Wallet Connection */}
      <div className="max-w-4xl mx-auto mb-8">
        {!isConnected ? (
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 text-center border border-white/10 shadow-xl">
            <h2 className="text-2xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
              Connect Your Wallet
            </h2>
            {connectionError && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm backdrop-blur-sm">
                {connectionError}
              </div>
            )}
            <button
              onClick={handleConnectWallet}
              disabled={isConnecting}
              className={`
                bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600
                px-8 py-4 rounded-xl font-semibold text-lg
                transition-all duration-300 transform hover:scale-105
                flex items-center justify-center gap-3 shadow-lg
                ${isConnecting ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {isConnecting ? (
                <>
                  <span className="animate-spin text-2xl">⚡</span>
                  Connecting...
                </>
              ) : (
                <>
                  <span className="text-2xl">👛</span>
                  Connect Wallet
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 flex justify-between items-center border border-white/10 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-pink-500 to-violet-500 flex items-center justify-center text-2xl shadow-lg">
                👛
              </div>
              <div>
                <span className="text-gray-300 block text-sm">Connected Wallet</span>
                <span className="font-mono text-sm bg-white/5 px-3 py-1 rounded-lg">{formatAddress(address || '')}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowTransferModal(true)}
                className="bg-white/10 hover:bg-white/20 px-6 py-2.5 rounded-xl text-sm transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
              >
                Transfer
              </button>
              <button
                onClick={() => disconnect()}
                className="bg-red-500/20 hover:bg-red-500/30 px-6 py-2.5 rounded-xl text-sm transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
              >
                Disconnect
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Balance Display */}
      {isConnected && (
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 flex justify-between items-center border border-white/10 shadow-xl">
            <div className="flex items-center gap-4">
              <span className="text-gray-300">Your Balance</span>
              <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
                {balance ? Number(formatEther(balance.value)).toFixed(2) : '0.00'} {balance?.symbol}
              </span>
            </div>
            <button
              onClick={() => setShowDepositModal(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 px-6 py-2.5 rounded-xl text-sm transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
            >
              <span className="text-xl">💰</span> Add Funds
            </button>
          </div>
        </div>
      )}

      {/* Number Selection */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
              Select Your Numbers
            </h2>
            <div className="flex gap-3">
              {selectedNumbers.length > 0 && (
                <button
                  onClick={handleClearSelection}
                  className="bg-red-500/20 hover:bg-red-500/30 px-6 py-2.5 rounded-xl text-sm transition-all duration-300 transform hover:scale-105 backdrop-blur-sm flex items-center gap-2"
                >
                  <span className="text-xl">🗑️</span> Clear
                </button>
              )}
              <button
                onClick={handleQuickPick}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-6 py-2.5 rounded-xl text-sm transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
              >
                <span className="text-xl">🎲</span> Quick Pick
              </button>
            </div>
          </div>
          <div className="grid grid-cols-10 gap-3 max-w-2xl mx-auto">
            {Array.from({ length: 50 }, (_, i) => i + 1).map((number) => (
              <button
                key={number}
                onClick={() => handleNumberSelect(number)}
                className={`
                  w-12 h-12 rounded-xl text-center text-lg
                  ${
                    selectedNumbers.includes(number)
                      ? 'bg-gradient-to-r from-pink-500 to-violet-500 text-white shadow-lg scale-110'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }
                  border border-white/10 transition-all duration-300
                  flex items-center justify-center font-semibold
                  hover:scale-105 backdrop-blur-sm
                `}
              >
                {number}
              </button>
            ))}
          </div>
          
          <div className="mt-8 flex justify-between items-center">
            <div className="flex gap-3">
              {selectedNumbers.sort((a, b) => a - b).map((number) => (
                <div
                  key={number}
                  className="w-12 h-12 rounded-xl bg-gradient-to-r from-pink-500 to-violet-500 flex items-center justify-center font-bold text-lg shadow-lg"
                >
                  {number}
                </div>
              ))}
              {Array(5 - selectedNumbers.length)
                .fill(null)
                .map((_, i) => (
                  <div
                    key={i}
                    className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-xl backdrop-blur-sm border border-white/10"
                  >
                    ?
                  </div>
                ))}
            </div>
            <button
              onClick={handlePlaceBet}
              className={`
                px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105
                ${
                  selectedNumbers.length === 5 && isConnected
                    ? 'bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 shadow-lg'
                    : 'bg-white/10 cursor-not-allowed'
                }
              `}
              disabled={!isConnected || selectedNumbers.length !== 5}
              onMouseEnter={() => {
                // Remove hover logging
              }}
            >
              Place Bet (1.5 USDT)
            </button>
          </div>
        </div>
      </div>

      {/* Tickets Section */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 shadow-xl">
          <h2 className="text-2xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
            Your Tickets
          </h2>
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/15 transition-all duration-300">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-300">Ticket #{ticket.id}</span>
                  <span className="text-sm text-gray-300">{ticket.drawNumber}</span>
                </div>
                <div className="flex gap-3 mb-4">
                  {ticket.numbers.map((number) => (
                    <div
                      key={number}
                      className="w-10 h-10 rounded-xl bg-gradient-to-r from-pink-500 to-violet-500 flex items-center justify-center font-bold text-sm shadow-lg"
                    >
                      {number}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <span className={`px-4 py-1.5 rounded-lg text-xs font-semibold ${
                    ticket.status === 'won' ? 'bg-green-500/20 text-green-400' :
                    ticket.status === 'lost' ? 'bg-red-500/20 text-red-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {ticket.status.toUpperCase()}
                  </span>
                  <span className="text-sm text-gray-300">1.5 USDT</span>
                </div>
              </div>
            ))}
            {tickets.length === 0 && (
              <div className="text-center text-gray-400 py-12 text-lg">
                No tickets yet. Place your first bet!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Next Draw Timer */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/10 shadow-xl">
          <h3 className="text-xl font-semibold mb-3 text-gray-300">Next Draw In</h3>
          <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
            47:59:59
          </div>
        </div>
      </div>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full border border-white/10 shadow-xl">
            <h2 className="text-2xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
              Add Funds
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Amount (USDT)</label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full bg-white/10 rounded-xl px-4 py-3 text-white border border-white/10 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all duration-300"
                  placeholder="0.00"
                  min="0"
                  step="0.1"
                />
              </div>
              {betError && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm backdrop-blur-sm">
                  {betError}
                </div>
              )}
              <div className="flex gap-3">
                <button
                  onClick={handleDeposit}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Deposit
                </button>
                <button
                  onClick={() => {
                    setShowDepositModal(false);
                    setDepositAmount('');
                    setBetError(null);
                  }}
                  className="flex-1 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full border border-white/10 shadow-xl">
            <h2 className="text-2xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
              Transfer USDT
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Recipient Address</label>
                <input
                  type="text"
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  className="w-full bg-white/10 rounded-xl px-4 py-3 text-white border border-white/10 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all duration-300"
                  placeholder="0x..."
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Amount (USDT)</label>
                <input
                  type="number"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  className="w-full bg-white/10 rounded-xl px-4 py-3 text-white border border-white/10 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all duration-300"
                  placeholder="0.00"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleTransfer}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Transfer
                </button>
                <button
                  onClick={() => setShowTransferModal(false)}
                  className="flex-1 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
