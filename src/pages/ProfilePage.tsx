import { useAccount, useDisconnect } from 'wagmi';
import { useBasename } from '../hooks/useBasename';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Award, Trophy, User as UserIcon, LogOut } from 'lucide-react';

export default function ProfilePage() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { name: basename, avatar } = useBasename(address);
  const navigate = useNavigate();

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-white text-center">
        <h1 className="text-4xl font-black italic mb-4">LOST IN THE GLITCH</h1>
        <p className="mb-8 opacity-70">Connect your wallet to view your profile and achievements.</p>
        <button 
          onClick={() => navigate('/')}
          className="px-8 py-3 neubrutal-border bg-brand text-white shadow-neubrutal-blue font-black italic"
        >
          BACK TO START
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-4 md:p-8 pt-20">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-white opacity-70 hover:opacity-100 transition-opacity"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-black italic text-xs">BACK TO GLITCH</span>
        </button>

        {/* Profile Header */}
        <div className="neubrutal-border bg-white p-8 mb-8 relative mt-10">
          <div className="absolute -top-12 left-8">
             <div className="relative">
                <div className="w-24 h-24 neubrutal-border bg-accentGreen overflow-hidden shadow-neubrutal-green border-4">
                  {avatar ? (
                    <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-accentGreen">
                      <UserIcon className="w-12 h-12 text-black" />
                    </div>
                  )}
                </div>
             </div>
          </div>

          <div className="mt-12">
            <div className="inline-block px-4 py-2 bg-black text-white neubrutal-border shadow-[4px_4px_0px_#FF00FF] mb-4">
              <h2 className="text-2xl font-black italic">
                {basename || 'ANONYMOUS GLITCHER'}
              </h2>
            </div>
            
            <div className="p-3 bg-gray-100 neubrutal-border text-[10px] font-mono break-all mb-6 uppercase tracking-tighter">
              {address}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 neubrutal-border bg-brand text-white shadow-neubrutal-blue">
                <div className="text-[10px] uppercase font-black opacity-70 mb-1">Total Wins</div>
                <div className="text-2xl font-black italic">12</div>
              </div>
              <div className="p-4 neubrutal-border bg-accentYellow text-black shadow-neubrutal-yellow">
                <div className="text-[10px] uppercase font-black opacity-70 mb-1">Avg Score</div>
                <div className="text-2xl font-black italic">8.5</div>
              </div>
              <div className="p-4 neubrutal-border bg-accentGreen text-black shadow-neubrutal-green">
                <div className="text-[10px] uppercase font-black opacity-70 mb-1">Global Rank</div>
                <div className="text-2xl font-black italic">#42</div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="neubrutal-border bg-white p-8 mb-8">
          <h3 className="text-xl font-black italic mb-6 border-b-4 border-black pb-2 flex items-center gap-2">
            <Trophy className="w-6 h-6" />
            RECENT ACHIEVEMENTS
          </h3>

          <div className="space-y-4">
            {[
              { title: 'First Blood', desc: 'Solved your first glitch', color: 'bg-brand' },
              { title: 'Quiz Master', desc: 'Got 10 correct answers in a row', color: 'bg-accentPink' },
              { title: 'Glitch King', desc: 'Reached top 10 on the leaderboard', color: 'bg-accentGreen' }
            ].map((ach, i) => (
              <div key={i} className="flex items-center gap-4 p-4 neubrutal-border bg-gray-50 hover:translate-x-1 transition-transform cursor-pointer group shadow-neubrutal">
                <div className={`w-12 h-12 flex items-center justify-center neubrutal-border ${ach.color} text-white shrink-0`}>
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-black italic uppercase text-sm leading-none mb-1">{ach.title}</div>
                  <div className="text-[10px] opacity-60 font-bold uppercase tracking-tight">{ach.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button 
            className="flex-1 py-4 neubrutal-border bg-brand text-white shadow-neubrutal-blue font-black italic uppercase tracking-widest hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all text-sm"
          >
            EDIT PROFILE
          </button>
          <button 
            onClick={() => {
              disconnect();
              navigate('/');
            }}
            className="px-6 py-4 neubrutal-border bg-accentPink text-white shadow-neubrutal-pink font-black italic uppercase flex items-center justify-center gap-2 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
            title="Disconnect Wallet"
          >
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
