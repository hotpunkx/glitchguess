import { useEffect, useState } from 'react';
import { useWriteContract, useAccount, useWaitForTransactionReceipt } from 'wagmi';
import { Share2, RefreshCw, ArrowLeft, Trophy } from 'lucide-react';
import { toast } from 'sonner';
import { LEADERBOARD_ADDRESS, LEADERBOARD_ABI, VICTORY_NFT_ADDRESS, VICTORY_NFT_ABI } from '../../config/contracts';

interface EndScreenProps {
  isWon: boolean;
  questionCount: number;
  correctAnswer?: string;
  mode: 'human-thinks' | 'ai-thinks';
  category: string;
  onPlayAgain: () => void;
}

interface Confetti {
  id: number;
  left: number;
  delay: number;
  duration: number;
  color: string;
}

export function EndScreen({
  isWon,
  questionCount,
  correctAnswer,
  mode,
  category,
  onPlayAgain,
}: EndScreenProps) {
  const [confetti, setConfetti] = useState<Confetti[]>([]);
  const { address, isConnected } = useAccount();
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const handleSubmitScore = () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (LEADERBOARD_ADDRESS === '0x0000000000000000000000000000000000000000') {
      toast.error('Contract not deployed yet');
      return;
    }

    writeContract({
      address: LEADERBOARD_ADDRESS,
      abi: LEADERBOARD_ABI,
      functionName: 'submitScore',
      args: [BigInt(questionCount), mode, category],
    });
  };

  const handleMintNFT = () => {
    if (!isConnected) {
      toast.error('Connect wallet to mint NFT!');
      return;
    }
    
    writeContract({
      address: VICTORY_NFT_ADDRESS,
      abi: VICTORY_NFT_ABI,
      functionName: 'safeMint',
      args: [address!, BigInt(questionCount), category],
    });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success('On-chain action successful!');
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isWon) {
      const colors = ['#0d33f2', '#bef264', '#f472b6', '#ffffff'];
      const newConfetti: Confetti[] = Array.from({ length: 40 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 1,
        color: colors[Math.floor(Math.random() * colors.length)],
      }));
      setConfetti(newConfetti);
    }
  }, [isWon]);

  const handleShare = async () => {
    const winner = mode === 'human-thinks' ? 'AI' : 'Human';
    const result = isWon
      ? `${winner} won in ${questionCount} questions!`
      : `${winner} couldn't guess it in 20 questions!`;

    const shareText = `GLITCHGUESS 🎮\n${result}\n${correctAnswer ? `The answer was: ${correctAnswer}` : ''}\n\nPlay now:`;
    const shareUrl = window.location.href.split('?')[0];
    const fullShareText = `${shareText} ${shareUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: 'GLITCHGUESS', text: fullShareText });
      } catch (error) {}
    } else {
      try {
        await navigator.clipboard.writeText(fullShareText);
        toast.success('Copied to clipboard!');
      } catch (error) {
        toast.error('Failed to copy');
      }
    }
  };

  return (
    <div className="h-screen max-h-screen flex flex-col items-center justify-center p-4 bg-background relative overflow-hidden pb-8">
      <div className="absolute top-4 left-4 z-20">
        <button 
          onClick={onPlayAgain}
          className="neubrutal-border bg-white dark:bg-darkBg text-black dark:text-white p-1 shadow-neubrutal active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
          title="Back to menu"
        >
          <ArrowLeft size={20} />
        </button>
      </div>
      {isWon &&
        confetti.map((item) => (
          <div
            key={item.id}
            className="absolute w-3 h-3 animate-confetti z-0"
            style={{
              left: `${item.left}%`,
              backgroundColor: item.color,
              animationDelay: `${item.delay}s`,
              animationDuration: `${item.duration}s`,
              top: '-10%',
            }}
          />
        ))}

      <div className="w-full max-w-2xl flex flex-col gap-6 relative z-10 text-center">
        <header className="mb-2 shrink-0">
          <div className={`inline-block px-3 py-1 neubrutal-border mb-3 rotate-[-1deg] shadow-neubrutal ${isWon ? 'bg-accentGreen' : 'bg-accentPink'}`}>
            <span className="text-[10px] font-black uppercase tracking-widest text-black">
              {isWon ? 'Mission Accomplished' : 'Transmission Lost'}
            </span>
          </div>
          <h2 className="text-5xl xl:text-7xl font-black italic uppercase glitch-text leading-none">
            {isWon ? (mode === 'human-thinks' ? 'AI WON!' : 'YOU WON!') : (mode === 'human-thinks' ? 'AI LOST!' : 'GAME OVER!')}
          </h2>
        </header>

        <div className="neubrutal-border bg-white text-black p-6 shadow-neubrutal relative overflow-hidden shrink-0">
          <p className="text-xl font-black uppercase tracking-tighter mb-4">
            {isWon ? `Cracked in ${questionCount} questions` : `Out of time and data`}
          </p>
          
          {correctAnswer && (
            <div className="neubrutal-border bg-darkBg text-white p-4 shadow-neubrutal-pink rotate-[1deg]">
              <p className="text-[8px] font-black uppercase opacity-60 mb-0.5">Source Detected:</p>
              <p className="text-2xl font-black uppercase glitch-text tracking-widest leading-none">
                {correctAnswer}
              </p>
            </div>
          )}
        </div>

        {isWon && mode === 'ai-thinks' && !isSuccess && (
          <div className="shrink-0 flex gap-2">
            <button
              onClick={handleSubmitScore}
              disabled={isPending || isConfirming}
              className="flex-1 py-4 neubrutal-border bg-brand text-white shadow-neubrutal-blue font-black italic uppercase tracking-widest hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50"
            >
              {isPending || isConfirming ? 'PROCESSING...' : 'SUBMIT TO LEADERBOARD'}
            </button>
            <button
              onClick={handleMintNFT}
              disabled={isPending || isConfirming}
              className="flex-1 py-4 neubrutal-border bg-accentPink text-white shadow-neubrutal-pink font-black italic uppercase tracking-widest hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50"
            >
              {isPending || isConfirming ? 'MINTING...' : 'MINT VICTORY NFT'}
            </button>
          </div>
        )}

        {isSuccess && (
          <div className="shrink-0 p-4 neubrutal-border bg-accentGreen text-black font-black uppercase rotate-[-1deg] shadow-neubrutal">
            🎉 Score Saved to Leaderboard!
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 shrink-0">
          <button
            onClick={onPlayAgain}
            className="flex items-center justify-center gap-2 py-4 bg-accentGreen text-black neubrutal-border shadow-neubrutal-green font-black text-lg uppercase tracking-tighter hover:shadow-none transition-all active:translate-x-1 active:translate-y-1"
          >
            <RefreshCw size={18} /> AGAIN
          </button>
          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-2 py-4 bg-brand text-white neubrutal-border shadow-neubrutal-blue font-black text-lg uppercase tracking-tighter hover:shadow-none transition-all active:translate-x-1 active:translate-y-1"
          >
            <Share2 size={18} /> SHARE
          </button>
        </div>

        <button 
          onClick={() => window.location.href = '/'}
          className="text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity shrink-0"
        >
          Return to home base
        </button>
      </div>
    </div>
  );
}
