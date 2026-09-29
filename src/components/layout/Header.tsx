import React from 'react';
import { useWeb3 } from '../../context/Web3Context';
import { Bell, Flame, ShieldCheck, ChevronDown, Check, Coins } from 'lucide-react';
import { NetworkType } from '../../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openNotificationCenter: () => void;
  openWalletModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  openNotificationCenter,
  openWalletModal
}) => {
  const {
    isConnected,
    address,
    network,
    switchNetwork,
    bnbBalance,
    fadBalance,
    userTier,
    currentTierInfo,
    unreadNotifsCount,
    requestFaucet
  } = useWeb3();

  const [networkDropdownOpen, setNetworkDropdownOpen] = React.useState(false);

  const navLinks = [
    { id: 'launchpad', label: 'Launchpad' },
    { id: 'staking', label: 'Tiered Staking' },
    { id: 'fairlaunch', label: 'Fair Launch' },
    { id: 'vesting', label: 'Vesting' },
    { id: 'milestones', label: 'Milestones' },
    { id: 'audit', label: 'Security & Audits' },
    { id: 'contracts', label: 'Cross-Chain' },
    { id: 'factory', label: 'Gas Optimizer' },
    { id: 'governance', label: 'Governance' },
    { id: 'docs', label: 'Docs' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#1E293B] bg-[#080C14]/90 backdrop-blur-md">
      {/* Strict Top Bar Contract: 3 Zones: Brand Title (single text element) - Nav Links - Actions */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setActiveTab('launchpad')}
          className="text-left font-display text-xl font-bold tracking-tight text-white hover:text-amber-400 transition-colors shrink-0"
        >
          <span className="text-amber-500">FAD</span>
        </button>

        {/* Zone 2: 4-6 primary nav links with subtle hover states */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.slice(0, 7).map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 text-xs xl:text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? 'text-amber-400 border-b-2 border-amber-400'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            );
          })}

          {/* More Dropdown for additional tools */}
          <div className="relative group">
            <button className="flex items-center gap-1 px-3 py-1.5 text-xs xl:text-sm font-medium text-slate-300 hover:text-white transition-colors">
              <span>More</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            <div className="absolute top-full left-0 hidden group-hover:block w-44 py-2 mt-1 bg-[#0F172A] border border-slate-800 rounded-lg shadow-xl z-50">
              {navLinks.slice(7).map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full text-left px-4 py-2 text-xs transition-colors ${
                    activeTab === item.id
                      ? 'text-amber-400 bg-amber-500/10 font-medium'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Zone 3: 1-2 primary actions (Network Switcher, Faucet, Notifications, Wallet) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Faucet button */}
          <button
            onClick={requestFaucet}
            title="Instant BSC Testnet Faucet: +5 BNB & +10,000 $FAD"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-lg hover:bg-amber-500/20 transition-colors whitespace-nowrap"
          >
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span>Faucet</span>
          </button>

          {/* Network Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setNetworkDropdownOpen(!networkDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-200 bg-[#111827] border border-slate-800 rounded-lg hover:border-slate-700 transition-colors whitespace-nowrap"
            >
              <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              <span className="hidden md:inline">
                {network === 'bsc-mainnet' ? 'BSC Mainnet' : 'BSC Testnet'}
              </span>
              <span className="md:hidden">BSC</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {networkDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 py-1.5 bg-[#0F172A] border border-slate-800 rounded-lg shadow-2xl z-50">
                <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Select BSC Chain
                </div>
                <button
                  onClick={() => {
                    switchNetwork('bsc-mainnet');
                    setNetworkDropdownOpen(false);
                  }}
                  className="flex items-center justify-between w-full px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-yellow-400" />
                    <span>BSC Mainnet (56)</span>
                  </div>
                  {network === 'bsc-mainnet' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                </button>
                <button
                  onClick={() => {
                    switchNetwork('bsc-testnet');
                    setNetworkDropdownOpen(false);
                  }}
                  className="flex items-center justify-between w-full px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>BSC Chapel Testnet (97)</span>
                  </div>
                  {network === 'bsc-testnet' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                </button>
              </div>
            )}
          </div>

          {/* Notifications Trigger */}
          <button
            onClick={openNotificationCenter}
            aria-label="Open notifications"
            className="relative p-2 text-slate-300 hover:text-white bg-[#111827] border border-slate-800 rounded-lg hover:border-slate-700 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifsCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-slate-950">
                {unreadNotifsCount}
              </span>
            )}
          </button>

          {/* Connect / Wallet Account Button */}
          {isConnected ? (
            <button
              onClick={openWalletModal}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-100 bg-[#162032] border border-amber-500/30 rounded-lg hover:bg-[#1E293B] hover:border-amber-400 transition-all whitespace-nowrap"
            >
              <div className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: currentTierInfo?.color || '#D97706' }}
                />
                <span className="font-mono tabular-nums text-amber-400 font-semibold">
                  {bnbBalance.toFixed(2)} BNB
                </span>
              </div>
              <span className="text-slate-500">|</span>
              <span className="font-mono text-slate-300">
                {address.slice(0, 6)}...{address.slice(-4)}
              </span>
              {currentTierInfo && (
                <span
                  className="hidden xl:inline text-[11px] px-1.5 py-0.5 rounded font-medium"
                  style={{
                    backgroundColor: `${currentTierInfo.color}20`,
                    color: currentTierInfo.color
                  }}
                >
                  {currentTierInfo.name.split(' ')[0]}
                </span>
              )}
            </button>
          ) : (
            <button
              onClick={openWalletModal}
              className="px-4 py-2 text-xs font-semibold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 rounded-lg hover:from-amber-300 hover:to-amber-400 transition-all shadow-md shadow-amber-500/20 whitespace-nowrap"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
