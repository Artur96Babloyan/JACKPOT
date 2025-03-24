'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/Header';
import { Modal } from '@/components/Modal';
import { NumberButton } from '@/components/NumberButton';
import { useAccount } from 'wagmi';
import { useBalance } from '@/hooks/useBalance';
import { fadeIn, slideUp, scaleIn } from '@/utils/animations';

interface Ticket {
  id: string;
  numbers: number[];
  status: 'pending' | 'won' | 'lost';
  drawNumber: string;
}

export default function Home() {
  const { isConnected } = useAccount();
  const { balance, isLoading: isLoadingBalance, deposit, withdraw, transfer, error: balanceError } = useBalance();
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [transferAmount, setTransferAmount] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [betError, setBetError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState('47:59:59');
  const [activeTab, setActiveTab] = useState<'play' | 'tickets'>('play');
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

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const [hours, minutes, seconds] = prev.split(':').map(Number);
        if (seconds > 0) return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${(seconds - 1).toString().padStart(2, '0')}`;
        if (minutes > 0) return `${hours.toString().padStart(2, '0')}:${(minutes - 1).toString().padStart(2, '0')}:59`;
        if (hours > 0) return `${(hours - 1).toString().padStart(2, '0')}:59:59`;
        return '00:00:00';
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleNumberSelect = (number: number) => {
    if (selectedNumbers.includes(number)) {
      setSelectedNumbers(selectedNumbers.filter((n) => n !== number));
    } else if (selectedNumbers.length === 0) {
      setSelectedNumbers([number]);
    } else if (selectedNumbers.length < 5) {
      setSelectedNumbers([...selectedNumbers, number]);
    }
  };

  const handleQuickPick = () => {
    const numbers = new Set<number>();
    while (numbers.size < 5) {
      const randomNum = Math.floor(Math.random() * 50) + 1;
      numbers.add(randomNum);
    }
    const selectedNums = Array.from(numbers).sort((a, b) => a - b);
    setSelectedNumbers(selectedNums);
  };

  const handleClearSelection = () => {
    setSelectedNumbers([]);
  };

  const handlePlaceBet = async () => {
    if (selectedNumbers.length === 5) {
      if (parseFloat(balance) < BET_AMOUNT) {
        setBetError('Insufficient balance. Please add funds first.');
        setShowDepositModal(true);
        return;
      }

      try {
        await withdraw(BET_AMOUNT.toString());
        const newTicket: Ticket = {
          id: (tickets.length + 1).toString(),
          numbers: [...selectedNumbers].sort((a, b) => a - b),
          status: 'pending',
          drawNumber: `#${Math.floor(Math.random() * 10000)}`
        };
        setTickets([newTicket, ...tickets]);
        setSelectedNumbers([]);
        setBetError(null);
      } catch (error: unknown) {
        setBetError(error instanceof Error ? error.message : 'Failed to place bet. Please try again.');
      }
    }
  };

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      setBetError('Please enter a valid amount');
      return;
    }

    try {
      await deposit(depositAmount);
      setShowDepositModal(false);
      setDepositAmount('');
      setBetError(null);
    } catch (error: unknown) {
      setBetError(error instanceof Error ? error.message : 'Failed to deposit. Please try again.');
    }
  };

  const handleTransfer = async () => {
    if (!recipientAddress || !transferAmount || parseFloat(transferAmount) <= 0) {
      setBetError('Please enter valid recipient address and amount');
      return;
    }

    try {
      await transfer(recipientAddress, transferAmount);
      setShowTransferModal(false);
      setTransferAmount('');
      setRecipientAddress('');
      setBetError(null);
    } catch (error: unknown) {
      setBetError(error instanceof Error ? error.message : 'Failed to transfer. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#1E1B4B]">
      <Header />
      
      <main className="pt-20 pb-8 px-4">
        {/* Welcome Message */}
        <AnimatePresence>
          {!isConnected && (
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="max-w-4xl mx-auto mb-8 text-center"
            >
              <h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
                Welcome to JACKPOT
              </h1>
              <p className="text-gray-300 text-lg">
                Connect your wallet to start playing and win big!
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <AnimatePresence>
          {isConnected && (
            <motion.div
              variants={slideUp}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {/* Balance Display */}
              <div className="max-w-4xl mx-auto mb-6">
                <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/10 shadow-xl">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-300">Your Balance</h3>
                      <div className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
                        {isLoadingBalance ? 'Loading...' : `${balance} USDT`}
                      </div>
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowDepositModal(true)}
                        className="flex-1 sm:flex-none bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 px-6 py-3 rounded-xl transition-all duration-300 shadow-lg"
                      >
                        Add Funds
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowTransferModal(true)}
                        className="flex-1 sm:flex-none bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl transition-all duration-300 backdrop-blur-sm"
                      >
                        Transfer
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Tabs */}
              <div className="sm:hidden mb-6">
                <div className="bg-white/5 backdrop-blur-lg rounded-xl p-1 flex">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab('play')}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === 'play'
                        ? 'bg-gradient-to-r from-pink-500 to-violet-500 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Play
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab('tickets')}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === 'tickets'
                        ? 'bg-gradient-to-r from-pink-500 to-violet-500 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Tickets
                  </motion.button>
                </div>
              </div>

              {/* Number Selection */}
              <AnimatePresence mode="wait">
                {activeTab === 'play' && (
                  <motion.div
                    key="play"
                    variants={scaleIn}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="max-w-4xl mx-auto mb-8"
                  >
                    <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/10 shadow-xl">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <h2 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
                          Select Your Numbers
                        </h2>
                        <div className="flex gap-3 w-full sm:w-auto">
                          {selectedNumbers.length > 0 && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={handleClearSelection}
                              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-xl text-sm transition-all duration-300"
                            >
                              <span className="text-xl">🗑️</span> Clear
                            </motion.button>
                          )}
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleQuickPick}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 rounded-xl text-sm transition-all duration-300"
                          >
                            <span className="text-xl">🎲</span> Quick Pick
                          </motion.button>
                        </div>
                      </div>

                      {/* Number Grid */}
                      <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 sm:gap-2">
                        {Array.from({ length: 50 }, (_, i) => i + 1).map((number) => (
                          <NumberButton
                            key={number}
                            number={number}
                            isSelected={selectedNumbers.includes(number)}
                            onClick={() => handleNumberSelect(number)}
                          />
                        ))}
                      </div>

                      {/* Place Bet Button */}
                      <div className="mt-6">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handlePlaceBet}
                          disabled={selectedNumbers.length !== 5}
                          className={`
                            w-full bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600
                            px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg
                            transition-all duration-300 shadow-lg
                            ${selectedNumbers.length !== 5 ? 'opacity-50 cursor-not-allowed' : ''}
                          `}
                        >
                          Place Bet ({BET_AMOUNT} USDT)
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Tickets Section */}
              <AnimatePresence mode="wait">
                {activeTab === 'tickets' && (
                  <motion.div
                    key="tickets"
                    variants={scaleIn}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="max-w-4xl mx-auto mb-8"
                  >
                    <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/10 shadow-xl">
                      <h2 className="text-2xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
                        Your Tickets
                      </h2>
                      <div className="space-y-4">
                        {tickets.map((ticket) => (
                          <motion.div
                            key={ticket.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/5 backdrop-blur-sm rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                          >
                            <div className="flex flex-wrap gap-2">
                              {ticket.numbers.map((number) => (
                                <span
                                  key={number}
                                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/10 flex items-center justify-center text-sm sm:text-base font-semibold"
                                >
                                  {number}
                                </span>
                              ))}
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs sm:text-sm text-gray-400">{ticket.drawNumber}</span>
                              <span className={`
                                px-2 sm:px-3 py-1 rounded-xl text-xs sm:text-sm font-semibold
                                ${ticket.status === 'won' ? 'bg-green-500/20 text-green-400' :
                                  ticket.status === 'lost' ? 'bg-red-500/20 text-red-400' :
                                  'bg-yellow-500/20 text-yellow-400'}
                              `}>
                                {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                              </span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
        </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Next Draw Timer */}
              <div className="max-w-4xl mx-auto">
                <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-4 sm:p-6 text-center border border-white/10 shadow-xl">
                  <h3 className="text-lg sm:text-xl font-semibold mb-3 text-gray-300">Next Draw In</h3>
                  <motion.div
                    key={timeLeft}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500"
                  >
                    {timeLeft}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modals */}
        <Modal
          isOpen={showDepositModal}
          onClose={() => {
            setShowDepositModal(false);
            setDepositAmount('');
            setBetError(null);
          }}
          title="Add Funds"
        >
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
            {(betError || balanceError) && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm backdrop-blur-sm">
                {betError || balanceError}
              </div>
            )}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDeposit}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 px-6 py-3 rounded-xl transition-all duration-300 shadow-lg"
              >
                Deposit
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setShowDepositModal(false);
                  setDepositAmount('');
                  setBetError(null);
                }}
                className="flex-1 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl transition-all duration-300 backdrop-blur-sm"
              >
                Cancel
              </motion.button>
            </div>
          </div>
        </Modal>

        <Modal
          isOpen={showTransferModal}
          onClose={() => setShowTransferModal(false)}
          title="Transfer USDT"
        >
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
            {(betError || balanceError) && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm backdrop-blur-sm">
                {betError || balanceError}
              </div>
            )}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleTransfer}
                className="flex-1 bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 px-6 py-3 rounded-xl transition-all duration-300 shadow-lg"
              >
                Transfer
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowTransferModal(false)}
                className="flex-1 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl transition-all duration-300 backdrop-blur-sm"
              >
                Cancel
              </motion.button>
            </div>
          </div>
        </Modal>
      </main>
    </div>
  );
}
