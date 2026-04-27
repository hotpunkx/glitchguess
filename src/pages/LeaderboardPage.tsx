import { useNavigate } from 'react-router-dom';
import { useReadContract } from 'wagmi';
import { ArrowLeft, Trophy, Clock, Target, Tag } from 'lucide-react';
import { LEADERBOARD_ADDRESS, LEADERBOARD_ABI, BASESCAN_URL } from '../config/contracts';
import { Button } from '@/components/ui/button';
import { WalletConnect } from '@/components/common/WalletConnect';

export default function LeaderboardPage() {
  const navigate = useNavigate();

  const { data: scores, isLoading, isError, refetch } = useReadContract({
    address: LEADERBOARD_ADDRESS,
    abi: LEADERBOARD_ABI,
    functionName: 'getTopScores',
    args: [BigInt(100)],
  });

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8 flex flex-col items-center overflow-x-hidden">
      <div className="w-full max-w-4xl space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="neubrutal-border bg-white dark:bg-darkBg text-black dark:text-white p-2 shadow-neubrutal active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
          >
            <ArrowLeft size={24} />
          </button>
          
          <div className="flex-1 text-center">
            <div className="inline-block px-4 py-1 neubrutal-border bg-accentGreen mb-4 rotate-[-1deg] shadow-neubrutal">
              <span className="text-xs font-black uppercase tracking-widest text-black flex items-center gap-2">
                <Trophy size={14} /> Global Rankings
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black italic uppercase glitch-text leading-none tracking-tighter">
              LEADERBOARD
            </h1>
          </div>
          
          <div className="w-12" /> {/* Spacer for centering */}
        </div>

        {/* Wallet Connection - ADDED HERE */}
        <div className="flex justify-center">
          <WalletConnect isInline />
        </div>

        {/* Content */}
        <div className="neubrutal-border bg-white text-black p-6 shadow-neubrutal-pink relative overflow-hidden">
          {isLoading ? (
            <div className="py-20 text-center">
              <div className="inline-block animate-spin w-12 h-12 border-4 border-black border-t-transparent rounded-full mb-4"></div>
              <p className="font-black uppercase tracking-widest animate-pulse">Syncing with Mainnet...</p>
            </div>
          ) : isError ? (
            <div className="py-20 text-center space-y-4">
              <p className="text-accentPink font-black text-xl uppercase">Error Reading Chain</p>
              <p className="text-sm font-bold opacity-60">Make sure the contract is deployed and your wallet is on Base.</p>
              <button 
                onClick={() => refetch()}
                className="px-6 py-2 bg-black text-white font-black uppercase text-xs neubrutal-border shadow-neubrutal"
              >
                Retry Connection
              </button>
            </div>
          ) : !scores || scores.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <div className="text-6xl mb-4">👻</div>
              <p className="text-xl font-black uppercase">The board is empty</p>
              <p className="text-sm font-bold opacity-60">Be the first to crack the glitch and claim your spot!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-4 border-black text-left">
                    <th className="pb-4 font-black uppercase text-sm px-2">Rank</th>
                    <th className="pb-4 font-black uppercase text-sm px-2">Player</th>
                    <th className="pb-4 font-black uppercase text-sm px-2 text-center">Qs Used</th>
                    <th className="pb-4 font-black uppercase text-sm px-2 hidden md:table-cell">Category</th>
                    <th className="pb-4 font-black uppercase text-sm px-2 text-right hidden sm:table-cell">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-gray-100">
                  {scores.map((score: any, index: number) => (
                    <tr key={index} className="group hover:bg-gray-50 transition-colors">
                      <td className="py-4 font-black text-2xl italic px-2">
                        #{index + 1}
                      </td>
                      <td className="py-4 px-2">
                        <a 
                          href={`${BASESCAN_URL}/address/${score.player}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-black text-brand hover:underline flex items-center gap-1"
                        >
                          {formatAddress(score.player)}
                        </a>
                        <span className="md:hidden block text-[8px] font-black uppercase opacity-40 mt-1">
                          {score.category}
                        </span>
                      </td>
                      <td className="py-4 px-2 text-center">
                        <div className="inline-flex items-center justify-center w-10 h-10 rounded-none neubrutal-border bg-accentGreen font-black text-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                          {Number(score.questionsUsed)}
                        </div>
                      </td>
                      <td className="py-4 px-2 hidden md:table-cell">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 neubrutal-border bg-darkBg text-white text-[10px] font-black uppercase rotate-[-1deg]">
                          <Tag size={10} className="text-accentPink" /> {score.category}
                        </span>
                      </td>
                      <td className="py-4 px-2 text-right hidden sm:table-cell">
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] font-black uppercase opacity-60 flex items-center gap-1">
                            <Clock size={10} /> {formatTimestamp(score.timestamp)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 opacity-40">
          <p className="text-[10px] font-black uppercase tracking-widest">Powered by Base Mainnet 🔷</p>
          <div className="flex gap-4">
            <a href={BASESCAN_URL} target="_blank" rel="noopener noreferrer" className="text-[10px] font-black uppercase tracking-widest border-b border-black">Contract</a>
            <a href="https://docs.base.org" target="_blank" rel="noopener noreferrer" className="text-[10px] font-black uppercase tracking-widest border-b border-black">Documentation</a>
          </div>
        </div>
      </div>
    </div>
  );
}
