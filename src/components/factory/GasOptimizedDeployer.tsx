import React, { useState } from 'react';
import { useWeb3 } from '../../context/Web3Context';
import {
  Flame,
  Zap,
  Cpu,
  CheckCircle2,
  ExternalLink,
  Code2,
  TrendingDown,
  Sparkles,
  ShieldCheck,
  Rocket
} from 'lucide-react';
import { GAS_METRICS } from '../../data/mockData';
import { Project } from '../../types';

interface GasOptimizedDeployerProps {
  setActiveTab: (tab: string) => void;
}

export const GasOptimizedDeployer: React.FC<GasOptimizedDeployerProps> = ({ setActiveTab }) => {
  const { deployLaunchpadProject, bnbBalance } = useWeb3();

  // Wizard Form state
  const [tokenName, setTokenName] = useState<string>('Galaxy FAD Network');
  const [tokenSymbol, setTokenSymbol] = useState<string>('GFAD');
  const [tagline, setTagline] = useState<string>('Decentralized AI Yield & Liquidity on BNB Smart Chain');
  const [category, setCategory] = useState<Project['category']>('DeFi');
  const [softCapBnb, setSoftCapBnb] = useState<number>(150);
  const [hardCapBnb, setHardCapBnb] = useState<number>(450);
  const [tokenPriceBnb, setTokenPriceBnb] = useState<number>(0.001);
  const [totalTokensSale, setTotalTokensSale] = useState<number>(450000);
  const [maxBuyBnb, setMaxBuyBnb] = useState<number>(3.0);
  const [liquidityLockPct, setLiquidityLockPct] = useState<number>(75);
  const [liquidityLockMonths, setLiquidityLockMonths] = useState<number>(24);
  const [tgeUnlockPct, setTgeUnlockPct] = useState<number>(20);
  const [cliffDays, setCliffDays] = useState<number>(30);
  const [vestingDays, setVestingDays] = useState<number>(180);

  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [deployedContract, setDeployedContract] = useState<string | null>(null);

  // Gas math comparison
  const standardCostBnb = (GAS_METRICS.standardDeployGasUnits * GAS_METRICS.standardGwei) / 1e9;
  const cloneCostBnb = (GAS_METRICS.eip1167CloneGasUnits * GAS_METRICS.standardGwei) / 1e9;
  const standardCostUsd = standardCostBnb * GAS_METRICS.bnbPriceUsd;
  const cloneCostUsd = cloneCostBnb * GAS_METRICS.bnbPriceUsd;
  const gasSavingsPct = (
    ((GAS_METRICS.standardDeployGasUnits - GAS_METRICS.eip1167CloneGasUnits) /
      GAS_METRICS.standardDeployGasUnits) *
    100
  ).toFixed(1);

  const handleDeploy = () => {
    setIsDeploying(true);
    setTimeout(() => {
      const contract = deployLaunchpadProject({
        name: tokenName,
        symbol: tokenSymbol,
        tagline,
        category,
        softCapBnb,
        hardCapBnb,
        tokenPriceBnb,
        totalTokensSale,
        maxBuyBnb,
        liquidityLockPct,
        liquidityLockMonths,
        vesting: {
          tgeUnlockPct,
          cliffDurationDays: cliffDays,
          vestingDurationDays: vestingDays,
          claimInterval: 'stream',
          totalTokensAllocated: totalTokensSale,
          tokensClaimed: 0,
          startTime: Date.now() + 86400000 * 2
        }
      });

      setDeployedContract(contract);
      setIsDeploying(false);
    }, 1800);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#0F172A] via-[#161C2C] to-[#0F172A] border border-slate-800 shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-medium border border-amber-500/30">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>EIP-1167 Minimal Proxy Clone Factory · Gas Optimization Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
          Deploy Launchpads with <span className="text-amber-400">94.9% Gas Reduction</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
          Standard launchpad factory deployments deploy massive repetitive bytecode costing upwards of 2,850,000 gas. FAD utilizes ultra-compact 45-byte EIP-1167 assembly clone proxies, reducing deployment cost to just 145,000 gas (~$0.08 on BSC).
        </p>
      </div>

      {/* Gas Comparison Dashboard */}
      <div className="p-6 bg-[#0F172A] border border-slate-800 rounded-xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">
              Gas Efficiency Comparison: Standard Factory vs FAD Clone
            </h2>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/30">
            {gasSavingsPct}% Cheaper
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Legacy Factory */}
          <div className="p-4 bg-[#0B0F19] rounded-xl border border-rose-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-rose-300">
                Standard Solidity Factory Deployment
              </span>
              <span className="text-[11px] text-slate-500 font-mono">Full Bytecode</span>
            </div>
            <div className="text-2xl font-bold font-mono text-slate-300 tabular-nums">
              2,850,000 <span className="text-xs text-slate-500">Gas Units</span>
            </div>
            <div className="text-xs text-slate-400 space-y-1 pt-1 border-t border-slate-800">
              <div className="flex justify-between">
                <span>Deploy Cost @ 1.0 Gwei:</span>
                <span className="font-mono text-rose-400 font-bold">{standardCostBnb.toFixed(5)} BNB (${standardCostUsd.toFixed(2)})</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Contract Bytecode Size:</span>
                <span>~24.5 KB (Near Spurious Dragon limit)</span>
              </div>
            </div>
          </div>

          {/* EIP-1167 Clone */}
          <div className="p-4 bg-gradient-to-r from-emerald-500/10 to-transparent rounded-xl border border-emerald-500/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                FAD EIP-1167 Minimal Proxy Clone
              </span>
              <span className="text-[11px] text-emerald-400 font-mono font-bold">45 Bytes Bytecode</span>
            </div>
            <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
              145,000 <span className="text-xs text-emerald-300">Gas Units</span>
            </div>
            <div className="text-xs text-slate-300 space-y-1 pt-1 border-t border-slate-800">
              <div className="flex justify-between">
                <span>Deploy Cost @ 1.0 Gwei:</span>
                <span className="font-mono text-emerald-400 font-bold">{cloneCostBnb.toFixed(5)} BNB (${cloneCostUsd.toFixed(2)})</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Direct Gas Savings:</span>
                <span className="font-mono text-emerald-400 font-bold">2,705,000 Gas Units</span>
              </div>
            </div>
          </div>
        </div>

        {/* Minimal Proxy Assembly Code Preview */}
        <div className="p-3.5 bg-[#080C14] rounded-lg border border-slate-800 font-mono text-xs text-slate-300 space-y-1">
          <div className="text-amber-400 text-[11px] font-bold">
            EIP-1167 Minimal Proxy EVM Bytecode:
          </div>
          <div className="text-[11px] text-slate-400 break-all select-all">
            363d3d373d3d3d363d73[20-byte-master-implementation-address]5af43d82803e903d91602b57fd5bf3
          </div>
        </div>
      </div>

      {/* Interactive Project Launcher Wizard */}
      <div className="p-6 bg-[#0F172A] border border-slate-800 rounded-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Rocket className="w-5 h-5 text-amber-400" />
              <span>Gas-Optimized Launchpad Creator</span>
            </h2>
            <p className="text-xs text-slate-400">
              Deploy your token IDO pool and automated vesting schedule with minimal gas on Binance Smart Chain.
            </p>
          </div>

          <div className="text-xs text-slate-400">
            Wallet Balance: <span className="font-mono text-amber-400 font-bold">{bnbBalance.toFixed(3)} BNB</span>
          </div>
        </div>

        {/* Deploy success feedback */}
        {deployedContract && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-2 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-300 font-semibold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Launchpad Pool Clone Successfully Spawned!</span>
              </div>
              <button
                onClick={() => setActiveTab('launchpad')}
                className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <span>View on Launchpad</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="text-xs text-slate-300 font-mono">
              Clone Proxy Address: <span className="text-amber-400">{deployedContract}</span>
            </div>
          </div>
        )}

        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
          {/* Token Name */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium">Token Name</label>
            <input
              type="text"
              value={tokenName}
              onChange={(e) => setTokenName(e.target.value)}
              className="w-full px-3 py-2 bg-[#0B0F19] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Token Symbol */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium">Token Symbol</label>
            <input
              type="text"
              value={tokenSymbol}
              onChange={(e) => setTokenSymbol(e.target.value)}
              className="w-full px-3 py-2 bg-[#0B0F19] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full px-3 py-2 bg-[#0B0F19] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400"
            >
              <option value="DeFi">DeFi</option>
              <option value="AI & Data">AI & Data</option>
              <option value="Cross-Chain">Cross-Chain</option>
              <option value="Gaming & Metaverse">Gaming</option>
            </select>
          </div>

          {/* Soft Cap */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium">Soft Cap (BNB)</label>
            <input
              type="number"
              value={softCapBnb}
              onChange={(e) => setSoftCapBnb(parseFloat(e.target.value))}
              className="w-full px-3 py-2 bg-[#0B0F19] border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-amber-400 tabular-nums"
            />
          </div>

          {/* Hard Cap */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium">Hard Cap (BNB)</label>
            <input
              type="number"
              value={hardCapBnb}
              onChange={(e) => setHardCapBnb(parseFloat(e.target.value))}
              className="w-full px-3 py-2 bg-[#0B0F19] border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-amber-400 tabular-nums"
            />
          </div>

          {/* Token Price */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium">Token Price (BNB)</label>
            <input
              type="number"
              step="0.0001"
              value={tokenPriceBnb}
              onChange={(e) => setTokenPriceBnb(parseFloat(e.target.value))}
              className="w-full px-3 py-2 bg-[#0B0F19] border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-amber-400 tabular-nums"
            />
          </div>

          {/* Max Buy */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium">Max Allocation Per Wallet (BNB)</label>
            <input
              type="number"
              value={maxBuyBnb}
              onChange={(e) => setMaxBuyBnb(parseFloat(e.target.value))}
              className="w-full px-3 py-2 bg-[#0B0F19] border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-amber-400 tabular-nums"
            />
          </div>

          {/* Liquidity Lock Pct */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium">PancakeSwap LP Lock (%)</label>
            <input
              type="number"
              min="60"
              max="100"
              value={liquidityLockPct}
              onChange={(e) => setLiquidityLockPct(parseInt(e.target.value))}
              className="w-full px-3 py-2 bg-[#0B0F19] border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-amber-400 tabular-nums"
            />
          </div>

          {/* Liquidity Lock Duration */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium">Liquidity Lock Duration (Months)</label>
            <input
              type="number"
              value={liquidityLockMonths}
              onChange={(e) => setLiquidityLockMonths(parseInt(e.target.value))}
              className="w-full px-3 py-2 bg-[#0B0F19] border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-amber-400 tabular-nums"
            />
          </div>

          {/* Vesting TGE */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium">Vesting: TGE Initial Unlock (%)</label>
            <input
              type="number"
              value={tgeUnlockPct}
              onChange={(e) => setTgeUnlockPct(parseInt(e.target.value))}
              className="w-full px-3 py-2 bg-[#0B0F19] border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-amber-400 tabular-nums"
            />
          </div>

          {/* Cliff */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium">Vesting Cliff (Days)</label>
            <input
              type="number"
              value={cliffDays}
              onChange={(e) => setCliffDays(parseInt(e.target.value))}
              className="w-full px-3 py-2 bg-[#0B0F19] border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-amber-400 tabular-nums"
            />
          </div>

          {/* Vesting Duration */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium">Linear Stream Duration (Days)</label>
            <input
              type="number"
              value={vestingDays}
              onChange={(e) => setVestingDays(parseInt(e.target.value))}
              className="w-full px-3 py-2 bg-[#0B0F19] border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-amber-400 tabular-nums"
            />
          </div>
        </div>

        {/* Deploy Button */}
        <div className="pt-2">
          <button
            onClick={handleDeploy}
            disabled={isDeploying}
            className="w-full py-3.5 font-semibold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 disabled:opacity-50 rounded-xl transition-all text-sm shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
          >
            {isDeploying ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Deploying Minimal Proxy via Assembly Clone Factory...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>Deploy Gas-Optimized Pool (Est. Cost: ~0.00014 BNB / $0.08)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
