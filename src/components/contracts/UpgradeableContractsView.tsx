import React, { useState } from 'react';
import { useWeb3 } from '../../context/Web3Context';
import {
  Layers,
  ArrowRightLeft,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Cpu,
  Zap,
  Lock,
  GitFork,
  ArrowRight,
  Boxes,
  RefreshCw
} from 'lucide-react';

export const UpgradeableContractsView: React.FC = () => {
  const { bnbBalance, fadBalance, playFadChime } = useWeb3();

  // Cross-chain bridge simulator state
  const [sourceChain, setSourceChain] = useState<string>('BSC');
  const [destChain, setDestChain] = useState<string>('Arbitrum');
  const [bridgeToken, setBridgeToken] = useState<string>('FAD');
  const [bridgeAmount, setBridgeAmount] = useState<string>('1000');
  const [bridgeStatus, setBridgeStatus] = useState<
    'idle' | 'approving' | 'relaying' | 'success'
  >('idle');
  const [bridgeTxHash, setBridgeTxHash] = useState<string>('');

  const chains = [
    { id: 'BSC', name: 'BNB Smart Chain', icon: '🟡', chainId: 56, feeUsd: 0.05 },
    { id: 'Ethereum', name: 'Ethereum Mainnet', icon: '🔷', chainId: 1, feeUsd: 2.45 },
    { id: 'Arbitrum', name: 'Arbitrum One', icon: '🔵', chainId: 42161, feeUsd: 0.12 },
    { id: 'Base', name: 'Base Network', icon: '⚪', chainId: 8453, feeUsd: 0.08 },
    { id: 'Polygon', name: 'Polygon PoS', icon: '🟣', chainId: 137, feeUsd: 0.04 }
  ];

  const handleBridge = () => {
    const amt = parseFloat(bridgeAmount) || 0;
    if (amt <= 0) return;

    setBridgeStatus('approving');
    setTimeout(() => {
      setBridgeStatus('relaying');
      setTimeout(() => {
        const fakeHash = `0x${Array.from({ length: 40 }, () =>
          Math.floor(Math.random() * 16).toString(16)
        ).join('')}`;
        setBridgeTxHash(fakeHash);
        setBridgeStatus('success');
        playFadChime();
      }, 2000);
    }, 1200);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#0F172A] via-[#151C2C] to-[#0F172A] border border-slate-800 shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-300 text-xs font-medium border border-sky-500/30">
          <Layers className="w-3.5 h-3.5 text-sky-400" />
          <span>ERC-1967 UUPS Upgradeable Architecture & Omnichain Liquidity</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
          Fully Upgradeable Contracts & <span className="text-amber-400">Cross-Chain Liquidity</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
          Future-proof protocols require non-destructive logic upgrades without migrating liquidity pools or breaking investor vesting balances. FAD employs the ERC-1967 UUPS standard and LayerZero Omnichain Fungible Token (OFT) endpoints.
        </p>
      </div>

      {/* 2 Key Pillars: Left = Proxy Architecture, Right = Cross-Chain Bridge */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: ERC-1967 UUPS & Diamond Architecture Visualizer */}
        <div className="p-6 bg-[#0F172A] border border-slate-800 rounded-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Boxes className="w-5 h-5 text-purple-400" />
              <h2 className="text-base font-bold text-white">
                ERC-1967 Proxy Architecture
              </h2>
            </div>
            <span className="text-xs font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/30">
              UUPS Standard
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            The proxy contract delegates all runtime calls to the implementation logic address via <code className="text-amber-300 font-mono">DELEGATECALL</code>, keeping user balances, vesting timetables, and pool state securely preserved in the proxy's storage slots.
          </p>

          {/* Interactive Proxy Slot Visualizer */}
          <div className="p-4 bg-[#0B0F19] rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
            <div className="text-[11px] text-slate-500 uppercase tracking-wider">
              Storage Layout & Timelock Governance
            </div>

            <div className="p-3 bg-[#080C14] rounded-lg border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span>EIP-1967 Implementation Slot:</span>
                <span className="text-emerald-400 font-bold">0x3608...8000</span>
              </div>
              <div className="text-[11px] text-slate-300 truncate">
                Slot: bytes32(uint256(keccak256("eip1967.proxy.implementation")) - 1)
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 bg-[#080C14] rounded border border-slate-800">
                <span className="text-slate-500">Admin Multi-Sig:</span>
                <div className="text-amber-300 font-semibold truncate mt-0.5">
                  0x9B42...4Fa1 (3-of-5)
                </div>
              </div>
              <div className="p-2.5 bg-[#080C14] rounded border border-slate-800">
                <span className="text-slate-500">Upgrade Timelock:</span>
                <div className="text-slate-200 font-semibold mt-0.5">
                  48-Hour Delay Guard
                </div>
              </div>
            </div>
          </div>

          {/* Diamond Standard Facets List */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-300">
              Diamond Facets (ERC-2535 Multi-Module):
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-[#0B0F19] rounded border border-slate-800 text-slate-300 flex items-center justify-between">
                <span>LaunchpadFacet.sol</span>
                <span className="text-emerald-400 text-[10px]">Active</span>
              </div>
              <div className="p-2 bg-[#0B0F19] rounded border border-slate-800 text-slate-300 flex items-center justify-between">
                <span>VestingVaultFacet.sol</span>
                <span className="text-emerald-400 text-[10px]">Active</span>
              </div>
              <div className="p-2 bg-[#0B0F19] rounded border border-slate-800 text-slate-300 flex items-center justify-between">
                <span>TierStakingFacet.sol</span>
                <span className="text-emerald-400 text-[10px]">Active</span>
              </div>
              <div className="p-2 bg-[#0B0F19] rounded border border-slate-800 text-slate-300 flex items-center justify-between">
                <span>MilestoneEscrowFacet.sol</span>
                <span className="text-emerald-400 text-[10px]">Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Omnichain Liquidity Bridge Terminal */}
        <div className="p-6 bg-[#0F172A] border border-slate-800 rounded-xl space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-amber-400" />
                <h2 className="text-base font-bold text-white">
                  Cross-Chain Liquidity Bridge
                </h2>
              </div>
              <span className="text-xs font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                LayerZero V2 Endpoint
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Bridge $FAD and incubated launchpad tokens natively across EVM networks with zero wrapped asset vulnerability or central bridge custody risks.
            </p>

            {/* Bridge Form */}
            <div className="space-y-3">
              {/* Chain Selection */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#0B0F19] rounded-lg border border-slate-800 space-y-1">
                  <label className="text-[11px] text-slate-400">Source Network</label>
                  <select
                    value={sourceChain}
                    onChange={(e) => setSourceChain(e.target.value)}
                    className="w-full bg-transparent text-xs text-white font-semibold focus:outline-none"
                  >
                    {chains.map((c) => (
                      <option key={c.id} value={c.id} className="bg-slate-900">
                        {c.icon} {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-3 bg-[#0B0F19] rounded-lg border border-slate-800 space-y-1">
                  <label className="text-[11px] text-slate-400">Destination Network</label>
                  <select
                    value={destChain}
                    onChange={(e) => setDestChain(e.target.value)}
                    className="w-full bg-transparent text-xs text-white font-semibold focus:outline-none"
                  >
                    {chains
                      .filter((c) => c.id !== sourceChain)
                      .map((c) => (
                        <option key={c.id} value={c.id} className="bg-slate-900">
                          {c.icon} {c.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Amount Input */}
              <div className="p-3 bg-[#0B0F19] rounded-lg border border-slate-800 space-y-1">
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Transfer Amount</span>
                  <span>Wallet: {fadBalance.toLocaleString()} $FAD</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={bridgeAmount}
                    onChange={(e) => setBridgeAmount(e.target.value)}
                    className="w-full bg-transparent text-base font-bold font-mono text-white focus:outline-none"
                    placeholder="0"
                  />
                  <span className="absolute right-0 top-0 text-xs font-mono font-bold text-amber-400">
                    $FAD
                  </span>
                </div>
              </div>

              {/* Bridge fee & time */}
              <div className="p-2.5 bg-[#0B0F19] rounded-lg border border-slate-800 text-[11px] space-y-1 text-slate-400">
                <div className="flex justify-between">
                  <span>Relayer Messaging Fee:</span>
                  <span className="font-mono text-slate-200">0.0012 BNB (~$0.72)</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Cross-Chain Finality:</span>
                  <span className="font-mono text-emerald-400">~15-30 Seconds</span>
                </div>
              </div>

              {/* Status display */}
              {bridgeStatus === 'approving' && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs text-amber-300 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                  <span>Step 1/2: Approving LayerZero Endpoint Router...</span>
                </div>
              )}
              {bridgeStatus === 'relaying' && (
                <div className="p-3 bg-sky-500/10 border border-sky-500/30 rounded-lg text-xs text-sky-300 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-sky-400" />
                  <span>Step 2/2: Relaying packet across decentralized DVN oracles...</span>
                </div>
              )}
              {bridgeStatus === 'success' && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-xs text-emerald-300 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Cross-chain bridge dispatched successfully!</span>
                  </div>
                  <a
                    href={`https://layerzeroscan.com/tx/${bridgeTxHash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-400 hover:underline inline-flex items-center gap-1 font-mono text-[11px]"
                  >
                    <span>LayerZero Scan</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleBridge}
            disabled={bridgeStatus === 'approving' || bridgeStatus === 'relaying'}
            className="w-full py-3 font-semibold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 disabled:opacity-50 rounded-lg transition-colors text-sm shadow-md"
          >
            Dispatch Omnichain Bridge
          </button>
        </div>
      </div>
    </div>
  );
};
