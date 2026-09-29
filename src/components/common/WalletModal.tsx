import React, { useState } from 'react';
import { useWeb3 } from '../../context/Web3Context';
import { X, Check, Copy, ExternalLink, Coins, LogOut, ShieldAlert, Sparkles } from 'lucide-react';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose }) => {
  const {
    isConnected,
    address,
    walletName,
    network,
    bnbBalance,
    fadBalance,
    stakedFad,
    userTier,
    currentTierInfo,
    connectWallet,
    disconnectWallet,
    requestFaucet
  } = useWeb3();

  const [copied, setCopied] = useState(false);
  const [faucetPending, setFaucetPending] = useState(false);

  if (!isOpen) return null;

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFaucet = () => {
    setFaucetPending(true);
    requestFaucet();
    setTimeout(() => setFaucetPending(false), 800);
  };

  const wallets = [
    {
      name: 'Binance Web3 Wallet',
      description: 'Official Binance ecosystem wallet for BSC',
      icon: '🟡',
      recommended: true
    },
    {
      name: 'MetaMask',
      description: 'Browser extension and mobile Web3 wallet',
      icon: '🦊',
      recommended: false
    },
    {
      name: 'Trust Wallet',
      description: 'Multi-crypto wallet on BNB Chain',
      icon: '🛡️',
      recommended: false
    },
    {
      name: 'WalletConnect',
      description: 'Connect via QR code or mobile link',
      icon: '🔗',
      recommended: false
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0F172A] border border-slate-800 rounded-xl shadow-2xl p-6 text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h3 className="text-base font-semibold text-white">
            {isConnected ? 'Connected Wallet' : 'Connect Web3 Wallet'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isConnected ? (
          <div className="mt-4 space-y-4">
            {/* Wallet Address & Status */}
            <div className="p-3.5 bg-[#0B0F19] rounded-lg border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Active Account ({walletName})</span>
                <span className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {network === 'bsc-mainnet' ? 'BSC Mainnet' : 'BSC Testnet'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-semibold text-slate-200">
                  {address}
                </span>
                <button
                  onClick={copyAddress}
                  className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded transition-colors"
                  title="Copy Address"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Balances Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-[#0B0F19] border border-slate-800/80 rounded-lg">
                <div className="text-[11px] text-slate-400">BNB Balance</div>
                <div className="font-mono text-base font-bold text-amber-400 tabular-nums mt-0.5">
                  {bnbBalance.toFixed(4)} BNB
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  ≈ ${(bnbBalance * 600).toFixed(2)} USD
                </div>
              </div>

              <div className="p-3 bg-[#0B0F19] border border-slate-800/80 rounded-lg">
                <div className="text-[11px] text-slate-400">Staked $FAD</div>
                <div className="font-mono text-base font-bold text-amber-300 tabular-nums mt-0.5">
                  {stakedFad.toLocaleString()} FAD
                </div>
                <div className="text-[10px] text-slate-400">
                  Tier: <span className="font-medium text-amber-400">{userTier}</span>
                </div>
              </div>
            </div>

            {/* Faucet Dispatch Button */}
            <div className="p-3.5 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-amber-300">
                    BSC Testnet Faucet
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Get +5.0 BNB & +10,000 $FAD for instant testing
                  </div>
                </div>
                <button
                  onClick={handleFaucet}
                  disabled={faucetPending}
                  className="px-3 py-1.5 text-xs font-medium text-slate-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 rounded-lg transition-colors whitespace-nowrap shadow-sm"
                >
                  {faucetPending ? 'Sending...' : 'Claim Faucet'}
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between pt-2">
              <a
                href={`https://bscscan.com/address/${address}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-amber-400 transition-colors"
              >
                <span>View on BscScan</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => {
                  disconnectWallet();
                  onClose();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Disconnect</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4 space-y-2.5">
            <p className="text-xs text-slate-400 mb-2">
              Choose your preferred Binance Smart Chain compatible wallet to access tier allocations, fair launches, and staking vaults.
            </p>
            {wallets.map((wallet) => (
              <button
                key={wallet.name}
                onClick={() => {
                  connectWallet(wallet.name);
                  onClose();
                }}
                className="w-full flex items-center justify-between p-3 bg-[#0B0F19] hover:bg-[#162032] border border-slate-800 hover:border-amber-500/40 rounded-lg transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{wallet.icon}</span>
                  <div>
                    <div className="text-sm font-medium text-white group-hover:text-amber-300 transition-colors">
                      {wallet.name}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {wallet.description}
                    </div>
                  </div>
                </div>
                {wallet.recommended && (
                  <span className="text-[10px] px-2 py-0.5 rounded font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Recommended
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
