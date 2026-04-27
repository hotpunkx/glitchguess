import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useBasename } from '../../hooks/useBasename';
import { useNavigate } from 'react-router-dom';

interface WalletConnectProps {
  isInline?: boolean;
}

export function WalletConnect({ isInline }: WalletConnectProps) {
  const { address, isConnected, isConnecting } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { name: basename, avatar } = useBasename(address);
  const navigate = useNavigate();

  // Find Base Account connector first, fallback to first available
  const baseConnector = connectors.find((c) => c.name === 'Base Account');
  const injectedConnector = connectors.find((c) => c.name !== 'Base Account');

  const containerClass = isInline ? "flex gap-2" : "fixed top-4 right-16 z-[100] flex gap-2";

  if (isConnected && address) {
    return (
      <div className={containerClass}>
        <button
          onClick={() => navigate('/profile')}
          title="View Profile"
          className="h-10 w-10 flex items-center justify-center neubrutal-border bg-brand text-white shadow-neubrutal-blue active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
        >
          {avatar ? (
            <img src={avatar} alt="avatar" className="w-6 h-6 rounded-full" />
          ) : (
            <span className="text-lg">👤</span>
          )}
        </button>
        <button
          onClick={() => disconnect()}
          title="Click to disconnect"
          className="h-10 px-3 flex items-center gap-1.5 neubrutal-border bg-accentGreen text-black shadow-neubrutal-green active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
        >
          <span className="font-black text-[9px] uppercase tracking-widest leading-none">
            {basename || `${address.slice(0, 4)}…${address.slice(-3)}`}
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className={isInline ? "" : "fixed top-4 right-16 z-[100]"}>
      {/* Prefer Base Account (passkey), fall back to injected */}
      {baseConnector ? (
        <button
          onClick={() => connect({ connector: baseConnector })}
          disabled={isConnecting}
          title="Connect with Base Account (passkey)"
          className="h-10 px-3 flex items-center gap-1.5 neubrutal-border bg-brand text-white shadow-neubrutal-blue active:translate-x-1 active:translate-y-1 active:shadow-none transition-all disabled:opacity-50"
        >
          <span className="text-sm">🔷</span>
          <span className="font-black text-[9px] uppercase tracking-widest leading-none">
            {isConnecting ? 'Connecting…' : 'Connect'}
          </span>
        </button>
      ) : injectedConnector ? (
        <button
          onClick={() => connect({ connector: injectedConnector })}
          disabled={isConnecting}
          title="Connect wallet"
          className="h-10 px-3 flex items-center gap-1.5 neubrutal-border bg-brand text-white shadow-neubrutal-blue active:translate-x-1 active:translate-y-1 active:shadow-none transition-all disabled:opacity-50"
        >
          <span className="font-black text-[9px] uppercase tracking-widest leading-none">
            {isConnecting ? 'Connecting…' : 'Connect'}
          </span>
        </button>
      ) : null}
    </div>
  );
}
