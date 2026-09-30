import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../../context/Web3Context';
import {
  Clock,
  Coins,
  CheckCircle2,
  ExternalLink,
  Flame,
  ArrowRight,
  Sparkles,
  Lock,
  Unlock,
  AlertCircle
} from 'lucide-react';
import { ProjectLogo } from '../common/ProjectLogo';

export const VestingPortal: React.FC = () => {
  const { projects, userContributions, claimVestingTokens, bnbBalance } = useWeb3();

  // Tick for streaming second-by-second animation
  const [streamTick, setStreamTick] = useState<number>(0);
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [claimReceipt, setClaimReceipt] = useState<{
    projectId: string;
    tokensClaimed: number;
    txHash: string;
  } | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setStreamTick((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter projects user participated in
  const participatedProjects = projects.filter((p) => (userContributions[p.id] || 0) > 0);

  const handleClaim = (projectId: string) => {
    setClaimingId(projectId);
    setTimeout(() => {
      const res = claimVestingTokens(projectId);
      if (res.success) {
        setClaimReceipt({
          projectId,
          tokensClaimed: res.tokensClaimed,
          txHash: res.txHash
        });
        setTimeout(() => setClaimReceipt(null), 8000);
      }
      setClaimingId(null);
    }, 1000);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#0F172A] via-[#121B2B] to-[#0F172A] border border-slate-800 shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-medium border border-emerald-500/30">
          <Clock className="w-3.5 h-3.5 text-emerald-400" />
          <span>Binance Smart Chain Automated Streaming Vesting</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
          Automated Linear <span className="text-amber-400">Vesting Streams</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
          Tokens stream directly to your address block-by-block. No manual delays or coordinator approvals. Smart contract timelocks guarantee that cliff periods and linear vesting curves are enforced with 100% cryptographic transparency.
        </p>
      </div>

      {/* Claim notification receipt toast */}
      {claimReceipt && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center justify-between animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <div className="font-semibold text-white">
                Claim Transaction Confirmed!
              </div>
              <div className="text-[11px] text-emerald-300">
                Claimed {claimReceipt.tokensClaimed.toLocaleString()} tokens to your BSC wallet.
              </div>
            </div>
          </div>
          <a
            href={`https://bscscan.com/tx/${claimReceipt.txHash}`}
            target="_blank"
            rel="noreferrer"
            className="text-amber-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
          >
            <span>View TX</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {/* Vesting Allocations List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold font-display text-white">
            Your Active Token Streams ({participatedProjects.length})
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Streaming Rate: 1 Block / 3 Seconds</span>
          </div>
        </div>

        {participatedProjects.length === 0 ? (
          <div className="p-12 bg-[#0F172A] border border-slate-800 rounded-xl text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-slate-500 mx-auto" />
            <h3 className="text-base font-semibold text-white">No Active Vesting Allocations</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              You haven't participated in any IDOs or Fair Launches yet. Contribute to active pools to start streaming tokens.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {participatedProjects.map((project) => {
              const userBnb = userContributions[project.id] || 0;
              const isOverflow = project.raisedBnb > project.hardCapBnb;
              const tokenShare = isOverflow
                ? (userBnb / project.raisedBnb) * project.totalTokensSale
                : (userBnb / project.hardCapBnb) * project.totalTokensSale;

              const totalAllocated = Math.round(tokenShare);
              const tgeTokens = Math.round(totalAllocated * (project.vesting.tgeUnlockPct / 100));
              const vestedStreamTokens = totalAllocated - tgeTokens;

              // Streaming simulation math:
              // base claimable + live ticks
              const liveStreamBonus = (streamTick % 60) * 0.12;
              const unlockedSoFar = Math.min(totalAllocated, Math.round(tgeTokens + (vestedStreamTokens * 0.28) + liveStreamBonus));
              const claimableNow = +(unlockedSoFar * 0.45).toFixed(2);
              const lockedRemaining = Math.max(0, totalAllocated - unlockedSoFar);
              const progressPct = Math.min(100, (unlockedSoFar / totalAllocated) * 100);

              return (
                <div
                  key={project.id}
                  className="p-5 bg-[#0F172A] border border-slate-800 hover:border-amber-500/40 rounded-xl space-y-5 transition-all shadow-lg"
                >
                  {/* Top Bar */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <ProjectLogo
                        src={project.logo}
                        alt={project.name}
                        symbol={project.symbol}
                        className="w-10 h-10 rounded-lg border border-slate-700 bg-slate-800 object-cover"
                      />
                      <div>
                        <h3 className="text-base font-semibold text-white">
                          {project.name}
                        </h3>
                        <span className="text-xs font-mono font-bold text-amber-400">
                          ${project.symbol} · {project.vesting.tgeUnlockPct}% TGE
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] text-slate-500">Your Allocation</div>
                      <div className="font-mono text-sm font-bold text-white tabular-nums">
                        {totalAllocated.toLocaleString()} {project.symbol}
                      </div>
                    </div>
                  </div>

                  {/* Vesting Schedule Visual Bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Streamed Unlock Progress</span>
                      <span className="font-mono text-amber-400 font-bold tabular-nums">
                        {progressPct.toFixed(1)}%
                      </span>
                    </div>

                    <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-300"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                      <span>TGE: {tgeTokens.toLocaleString()} {project.symbol}</span>
                      <span>Linear: {project.vesting.vestingDurationDays} Days</span>
                      <span>Locked: {lockedRemaining.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Detailed Metric Boxes */}
                  <div className="grid grid-cols-3 gap-2.5 text-xs">
                    <div className="p-2.5 bg-[#0B0F19] rounded-lg border border-slate-800 text-center">
                      <div className="text-[10px] text-slate-500">Cliff Period</div>
                      <div className="font-mono font-semibold text-slate-200 mt-0.5">
                        {project.vesting.cliffDurationDays} Days
                      </div>
                    </div>

                    <div className="p-2.5 bg-[#0B0F19] rounded-lg border border-slate-800 text-center">
                      <div className="text-[10px] text-slate-500">Streaming Cadence</div>
                      <div className="font-mono font-semibold text-emerald-400 mt-0.5">
                        Continuous
                      </div>
                    </div>

                    <div className="p-2.5 bg-[#0B0F19] rounded-lg border border-slate-800 text-center">
                      <div className="text-[10px] text-slate-500">Est. Gas Cost</div>
                      <div className="font-mono font-semibold text-amber-300 mt-0.5">
                        ~$0.02 (BSC)
                      </div>
                    </div>
                  </div>

                  {/* Live Claimable Action Banner */}
                  <div className="p-3.5 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 rounded-lg flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-400 flex items-center gap-1.5">
                        <span>Streaming Claimable Balance</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      </div>
                      <div className="text-lg font-bold font-mono text-amber-300 tabular-nums">
                        {claimableNow.toLocaleString()} <span className="text-xs">{project.symbol}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleClaim(project.id)}
                      disabled={claimingId === project.id || claimableNow <= 0}
                      className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-40 rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
                    >
                      {claimingId === project.id ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                          <span>Streaming...</span>
                        </>
                      ) : (
                        <>
                          <Coins className="w-3.5 h-3.5" />
                          <span>Claim Tokens</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Vesting Architecture Features */}
      <div className="p-6 bg-[#0F172A] border border-slate-800 rounded-xl space-y-4">
        <h3 className="text-base font-bold font-display text-white">
          Why Automated Streaming Vesting Matters
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="p-3 bg-[#0B0F19] rounded-lg border border-slate-800 space-y-1.5">
            <div className="font-semibold text-amber-400 flex items-center gap-1.5">
              <Unlock className="w-4 h-4" />
              <span>Zero Lump-Sum Dump Pressure</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Instead of sudden massive token unlocks every 30 days crashing the DEX price, linear streaming releases small fractional tokens smoothly each block.
            </p>
          </div>

          <div className="p-3 bg-[#0B0F19] rounded-lg border border-slate-800 space-y-1.5">
            <div className="font-semibold text-emerald-400 flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>Claim Anytime, Gas-Optimized</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Tokens accumulate continuously in the timelock vault. You can claim once a day, once a month, or let them stack to minimize BSC gas fees.
            </p>
          </div>

          <div className="p-3 bg-[#0B0F19] rounded-lg border border-slate-800 space-y-1.5">
            <div className="font-semibold text-sky-400 flex items-center gap-1.5">
              <Lock className="w-4 h-4" />
              <span>Immutable On-Chain Vaults</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              100% of vesting tokens are locked in verified OpenZeppelin VestingVault smart contracts. Neither the project founder nor the launchpad can tamper with the schedule.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
