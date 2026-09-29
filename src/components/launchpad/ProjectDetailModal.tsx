import React, { useState } from 'react';
import { Project, Milestone } from '../../types';
import { useWeb3 } from '../../context/Web3Context';
import {
  X,
  ShieldCheck,
  ExternalLink,
  Lock,
  Flame,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Percent,
  Coins,
  FileCode2,
  Calendar,
  Vote
} from 'lucide-react';

interface ProjectDetailModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  setActiveTab: (tab: string) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  isOpen,
  onClose,
  setActiveTab
}) => {
  const {
    bnbBalance,
    userContributions,
    contributeToProject,
    userTier,
    currentTierInfo,
    voteMilestone,
    claimVestingTokens
  } = useWeb3();

  const [activeSubTab, setActiveSubTab] = useState<'ido' | 'milestones' | 'vesting' | 'audit'>('ido');
  const [contributionInput, setContributionInput] = useState<string>('0.5');
  const [txStatus, setTxStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  if (!isOpen || !project) return null;

  const userContributed = userContributions[project.id] || 0;
  const progressPct = Math.min(100, (project.raisedBnb / project.hardCapBnb) * 100);
  const isOversubscribed = project.raisedBnb > project.hardCapBnb;
  const overflowRatio = isOversubscribed ? project.raisedBnb / project.hardCapBnb : 1.0;

  // Real-time Overflow & Token Allocation Calculation
  const inputNum = parseFloat(contributionInput) || 0;
  const simulatedTotalContributed = userContributed + inputNum;

  // If overflow: userShare = (userPledged / totalPledged) * totalTokensSale
  // userUsedBnb = userShare * tokenPriceBnb
  // userRefundBnb = userPledged - userUsedBnb
  const simulatedTotalRaised = project.raisedBnb + inputNum;
  const estimatedTokenAllocation = isOversubscribed || simulatedTotalRaised > project.hardCapBnb
    ? (simulatedTotalContributed / simulatedTotalRaised) * project.totalTokensSale
    : (simulatedTotalContributed / project.hardCapBnb) * project.totalTokensSale;

  const estimatedUsedBnb = isOversubscribed || simulatedTotalRaised > project.hardCapBnb
    ? (estimatedTokenAllocation * project.tokenPriceBnb)
    : simulatedTotalContributed;

  const estimatedRefundBnb = Math.max(0, simulatedTotalContributed - estimatedUsedBnb);

  const handleContribute = () => {
    if (inputNum <= 0) return;
    const res = contributeToProject(project.id, inputNum);
    setTxStatus(res);
    if (res.success) {
      setTimeout(() => setTxStatus(null), 5000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#0B0F19] border border-slate-800 rounded-2xl shadow-2xl text-slate-100 overflow-hidden my-auto">
        {/* Banner & Header */}
        <div className="relative h-36 sm:h-48 w-full bg-slate-900 overflow-hidden shrink-0">
          <img
            src={project.banner}
            alt={project.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/40 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Project Identity Lockup */}
          <div className="absolute bottom-3 left-4 sm:left-6 flex items-end gap-3 sm:gap-4">
            <img
              src={project.logo}
              alt={project.name}
              referrerPolicy="no-referrer"
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl border-2 border-amber-500/40 bg-slate-900 object-cover shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold font-display text-white">
                  {project.name}
                </h2>
                <span className="text-xs font-mono font-bold text-amber-400">
                  ${project.symbol}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded font-mono bg-slate-800 text-slate-300 border border-slate-700">
                  {project.category}
                </span>
              </div>
              <p className="text-xs text-slate-300 hidden sm:block max-w-xl truncate">
                {project.tagline}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Inside Modal */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-800 bg-[#0E1422] shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('ido')}
            className={`pb-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeSubTab === 'ido'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            IDO & Fair Launch
          </button>
          <button
            onClick={() => setActiveSubTab('vesting')}
            className={`pb-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeSubTab === 'vesting'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Automated Vesting Schedule
          </button>
          <button
            onClick={() => setActiveSubTab('milestones')}
            className={`pb-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeSubTab === 'milestones'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Milestone Escrow ({project.milestones.length})
          </button>
          <button
            onClick={() => setActiveSubTab('audit')}
            className={`pb-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeSubTab === 'audit'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Security Audit ({project.audit.auditor} {project.audit.score}/100)
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB 1: IDO & FAIR LAUNCH PARTICIPATION */}
          {activeSubTab === 'ido' && (
            <div className="space-y-6">
              {/* Pool Progress & Cap Stats */}
              <div className="p-4 sm:p-5 bg-[#0F172A] border border-slate-800 rounded-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="text-xs text-slate-400">Total Funds Raised</div>
                    <div className="text-xl sm:text-2xl font-bold font-mono text-white tabular-nums">
                      {project.raisedBnb.toLocaleString()} <span className="text-amber-400">BNB</span>
                      <span className="text-xs text-slate-400 font-normal ml-2">
                        / {project.hardCapBnb} BNB Hard Cap
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-right">
                    <div>
                      <div className="text-xs text-slate-400">Tokens for Sale</div>
                      <div className="text-sm font-semibold font-mono text-slate-200 tabular-nums">
                        {project.totalTokensSale.toLocaleString()} {project.symbol}
                      </div>
                    </div>
                    <div className="border-l border-slate-800 pl-3">
                      <div className="text-xs text-slate-400">Token Price</div>
                      <div className="text-sm font-semibold font-mono text-amber-400 tabular-nums">
                        {project.tokenPriceBnb} BNB (${project.tokenPriceUsd})
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isOversubscribed
                          ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300'
                          : 'bg-gradient-to-r from-amber-600 to-amber-400'
                      }`}
                      style={{ width: `${Math.min(100, progressPct)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>Soft Cap: {project.softCapBnb} BNB</span>
                    <span className="font-semibold text-amber-400 tabular-nums">
                      {progressPct.toFixed(1)}% {isOversubscribed && `(${overflowRatio.toFixed(2)}x Overflow)`}
                    </span>
                    <span>Hard Cap: {project.hardCapBnb} BNB</span>
                  </div>
                </div>

                {isOversubscribed && (
                  <div className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-500/10 border border-amber-500/25 text-xs text-amber-200">
                    <Percent className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-amber-300">
                        Proportional Overflow Distribution Active
                      </div>
                      <div className="text-slate-300 text-[11px] mt-0.5 leading-relaxed">
                        This pool has exceeded its Hard Cap! Every participant will receive their fair proportional share of {project.symbol} tokens, and all surplus BNB will be automatically returned to your wallet upon pool settlement.
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* IDO Contribution Form & Real-time Calculator */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Left: Input & Tier Multiplier */}
                <div className="p-4 sm:p-5 bg-[#0F172A] border border-slate-800 rounded-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-white">Pledge BNB Allocation</h3>
                    <div className="text-xs text-slate-400">
                      Wallet: <span className="font-mono text-amber-400">{bnbBalance.toFixed(3)} BNB</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="relative">
                      <input
                        type="number"
                        step="0.05"
                        min={project.minBuyBnb}
                        max={project.maxBuyBnb}
                        value={contributionInput}
                        onChange={(e) => setContributionInput(e.target.value)}
                        className="w-full px-4 py-3 bg-[#0B0F19] border border-slate-700 rounded-lg text-white font-mono text-lg focus:outline-none focus:border-amber-400 tabular-nums"
                        placeholder="0.0"
                      />
                      <div className="absolute right-3 top-3 flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setContributionInput(project.maxBuyBnb.toString())}
                          className="px-2 py-1 text-[11px] font-semibold bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 rounded transition-colors"
                        >
                          MAX
                        </button>
                        <span className="font-mono text-sm text-slate-400 font-bold">BNB</span>
                      </div>
                    </div>

                    {/* Quick percentage buttons */}
                    <div className="grid grid-cols-4 gap-2 pt-1">
                      {[0.25, 0.5, 1.0, 2.0].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setContributionInput(val.toString())}
                          className="py-1 text-xs font-mono rounded bg-[#162032] hover:bg-slate-800 text-slate-300 transition-colors"
                        >
                          {val} BNB
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tier status indicator */}
                  <div className="p-3 bg-[#0B0F19] rounded-lg border border-slate-800 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Your Staking Tier:</span>
                      <span className="font-semibold text-amber-400">
                        {userTier} ({currentTierInfo?.poolWeight || 'Standard'})
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Max Wallet Cap:</span>
                      <span className="font-mono text-slate-200">{project.maxBuyBnb} BNB</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Already Pledged:</span>
                      <span className="font-mono text-amber-400 font-semibold">{userContributed} BNB</span>
                    </div>
                  </div>

                  {txStatus && (
                    <div
                      className={`p-3 rounded-lg text-xs ${
                        txStatus.success
                          ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                          : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {txStatus.message}
                    </div>
                  )}

                  <button
                    onClick={handleContribute}
                    className="w-full py-3 px-4 font-semibold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-lg shadow-lg shadow-amber-500/20 transition-all text-sm"
                  >
                    Confirm Fair Launch Pledge
                  </button>
                </div>

                {/* Right: Real-time Overflow & Return Math */}
                <div className="p-4 sm:p-5 bg-[#0F172A] border border-slate-800 rounded-xl space-y-4">
                  <h3 className="text-sm font-semibold text-white">
                    Fair Launch Proportional Math
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-[#0B0F19] rounded-lg border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Your Total Pledge:</span>
                        <span className="font-mono font-semibold text-slate-200 tabular-nums">
                          {simulatedTotalContributed.toFixed(4)} BNB
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Guaranteed {project.symbol} Allocation:</span>
                        <span className="font-mono font-bold text-amber-400 tabular-nums">
                          {Math.round(estimatedTokenAllocation).toLocaleString()} {project.symbol}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Actual BNB Spent:</span>
                        <span className="font-mono text-slate-300 tabular-nums">
                          ≈ {estimatedUsedBnb.toFixed(4)} BNB
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                        <span className="text-emerald-400 font-medium">Automatic BNB Refund:</span>
                        <span className="font-mono font-bold text-emerald-400 tabular-nums">
                          {estimatedRefundBnb.toFixed(4)} BNB
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-[#0B0F19] rounded-lg border border-slate-800 space-y-1.5 text-[11px] text-slate-400">
                      <div className="font-semibold text-slate-300">
                        Anti-Sniper Bot Rules Enforced:
                      </div>
                      <div>• Maximum 1 transaction per block per address</div>
                      <div>• Dynamic sniper tax (0% for human participants)</div>
                      <div>• PancakeSwap LP 100% locked for {project.liquidityLockMonths} months</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AUTOMATED VESTING SCHEDULE */}
          {activeSubTab === 'vesting' && (
            <div className="space-y-6">
              <div className="p-4 sm:p-5 bg-[#0F172A] border border-slate-800 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      Automated Linear Vesting Stream
                    </h3>
                    <p className="text-xs text-slate-400">
                      Protected by smart contract timelock vaults. Streamed second-by-second after cliff.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      setActiveTab('vesting');
                    }}
                    className="text-xs text-amber-400 hover:underline inline-flex items-center gap-1"
                  >
                    <span>Full Vesting Hub</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Vesting parameters grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-[#0B0F19] rounded-lg border border-slate-800">
                    <div className="text-[11px] text-slate-400">TGE Unlock</div>
                    <div className="text-lg font-bold font-mono text-amber-400 tabular-nums">
                      {project.vesting.tgeUnlockPct}%
                    </div>
                    <div className="text-[10px] text-slate-500">Immediate at launch</div>
                  </div>
                  <div className="p-3 bg-[#0B0F19] rounded-lg border border-slate-800">
                    <div className="text-[11px] text-slate-400">Cliff Duration</div>
                    <div className="text-lg font-bold font-mono text-slate-200 tabular-nums">
                      {project.vesting.cliffDurationDays} Days
                    </div>
                    <div className="text-[10px] text-slate-500">No token unlock</div>
                  </div>
                  <div className="p-3 bg-[#0B0F19] rounded-lg border border-slate-800">
                    <div className="text-[11px] text-slate-400">Linear Vesting</div>
                    <div className="text-lg font-bold font-mono text-slate-200 tabular-nums">
                      {project.vesting.vestingDurationDays} Days
                    </div>
                    <div className="text-[10px] text-slate-500">Continuous streaming</div>
                  </div>
                  <div className="p-3 bg-[#0B0F19] rounded-lg border border-slate-800">
                    <div className="text-[11px] text-slate-400">Release Cadence</div>
                    <div className="text-lg font-bold font-mono text-emerald-400 capitalize">
                      {project.vesting.claimInterval}
                    </div>
                    <div className="text-[10px] text-slate-500">Per-block claimable</div>
                  </div>
                </div>

                {/* Visual Vesting Chart Representation */}
                <div className="p-4 bg-[#0B0F19] rounded-lg border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>TGE (Day 0: {project.vesting.tgeUnlockPct}%)</span>
                    <span>Cliff (Day {project.vesting.cliffDurationDays})</span>
                    <span>100% Fully Vested (Day {project.vesting.vestingDurationDays})</span>
                  </div>

                  <div className="relative h-16 w-full bg-slate-900 rounded-lg overflow-hidden border border-slate-800 flex items-end px-2 pb-2">
                    {/* Stepped line representation */}
                    <svg className="w-full h-12 overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 50">
                      <path
                        d="M 0 40 L 15 30 L 30 30 L 100 5"
                        fill="none"
                        stroke="#F59E0B"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      <polygon
                        points="0,50 0,40 15,30 30,30 100,5 100,50"
                        fill="rgba(245, 158, 11, 0.12)"
                      />
                    </svg>
                  </div>
                </div>

                {/* User Claim Action */}
                <div className="p-3.5 bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/30 rounded-lg flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-400">Your Claimable Balance</div>
                    <div className="text-base font-bold font-mono text-amber-300 tabular-nums">
                      {userContributed > 0
                        ? `${Math.round(estimatedTokenAllocation * 0.25).toLocaleString()} ${project.symbol}`
                        : `0.00 ${project.symbol}`}
                    </div>
                  </div>
                  <button
                    onClick={() => claimVestingTokens(project.id)}
                    disabled={userContributed <= 0}
                    className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-40 rounded-lg transition-colors shadow-sm"
                  >
                    Claim Vested Tokens
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MILESTONES & TRANSPARENT ESCROW */}
          {activeSubTab === 'milestones' && (
            <div className="space-y-4">
              <div className="p-3 bg-[#0F172A] border border-slate-800 rounded-xl text-xs text-slate-300">
                <span className="font-semibold text-white">Decentralized Milestone Escrow:</span> 100% of raised BNB is deposited in an on-chain timelock escrow contract. Tranches are only unlocked after the community and FAD Security Council verify deliverables.
              </div>

              <div className="space-y-3">
                {project.milestones.map((milestone, idx) => (
                  <div
                    key={milestone.id}
                    className="p-4 bg-[#0F172A] border border-slate-800 rounded-xl space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-800 text-xs font-mono font-bold text-amber-400 border border-slate-700">
                          {idx + 1}
                        </span>
                        <div>
                          <h4 className="text-xs sm:text-sm font-semibold text-white">
                            {milestone.title}
                          </h4>
                          <span className="text-[11px] text-slate-400">
                            Due: {milestone.dueDate} · Release: {milestone.percentageRelease}% ({milestone.amountBnb} BNB)
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {milestone.status === 'released' && (
                          <span className="text-[11px] px-2 py-0.5 rounded font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            Released to Devs
                          </span>
                        )}
                        {milestone.status === 'under_review' && (
                          <span className="text-[11px] px-2 py-0.5 rounded font-medium bg-amber-500/10 text-amber-400 border border-amber-500/30">
                            Community Review Active
                          </span>
                        )}
                        {milestone.status === 'pending' && (
                          <span className="text-[11px] px-2 py-0.5 rounded font-medium bg-slate-800 text-slate-400 border border-slate-700">
                            Locked in Timelock
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      {milestone.description}
                    </p>

                    {milestone.verificationHash && (
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                        <span>On-Chain Deliverable Proof:</span>
                        <a
                          href={`https://bscscan.com/tx/${milestone.verificationHash}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-amber-400 hover:underline flex items-center gap-1"
                        >
                          <span>{milestone.verificationHash.slice(0, 18)}...</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}

                    {/* Voting controls for milestone */}
                    {milestone.status === 'under_review' && (
                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                        <div className="text-xs text-slate-400">
                          Community Consensus:{' '}
                          <span className="text-emerald-400 font-mono font-semibold">
                            {milestone.approvalVotesYes} YES
                          </span>{' '}
                          / <span className="text-rose-400 font-mono font-semibold">{milestone.approvalVotesNo} NO</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => voteMilestone(project.id, milestone.id, 'yes')}
                            className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
                              milestone.userVoted === 'yes'
                                ? 'bg-emerald-500 text-slate-950'
                                : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                            }`}
                          >
                            Approve Release
                          </button>
                          <button
                            onClick={() => voteMilestone(project.id, milestone.id, 'no')}
                            className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
                              milestone.userVoted === 'no'
                                ? 'bg-rose-500 text-white'
                                : 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30'
                            }`}
                          >
                            Dispute
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SECURITY AUDIT INTEGRATION */}
          {activeSubTab === 'audit' && (
            <div className="space-y-4">
              <div className="p-4 sm:p-5 bg-[#0F172A] border border-slate-800 rounded-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0" />
                    <div>
                      <h3 className="text-sm font-semibold text-white">
                        {project.audit.auditor} Security Verification
                      </h3>
                      <div className="text-xs text-slate-400">
                        Audited on {project.audit.date} · Standard: {project.audit.proxyStandard}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-[11px] text-slate-400">Security Score</div>
                      <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
                        {project.audit.score}/100
                      </div>
                    </div>
                    <a
                      href={project.audit.reportUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-2 text-xs font-semibold bg-[#162032] hover:bg-slate-800 text-amber-300 border border-amber-500/30 rounded-lg inline-flex items-center gap-1.5 transition-colors"
                    >
                      <span>PDF Report</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* 8-Point Security Checklist */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center justify-between p-2.5 bg-[#0B0F19] rounded-lg border border-slate-800">
                    <span className="text-slate-400">Reentrancy Protection</span>
                    <span className="flex items-center gap-1 text-emerald-400 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" /> OpenZeppelin
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-[#0B0F19] rounded-lg border border-slate-800">
                    <span className="text-slate-400">Honeypot & Blacklist Check</span>
                    <span className="flex items-center gap-1 text-emerald-400 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Passed 100%
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-[#0B0F19] rounded-lg border border-slate-800">
                    <span className="text-slate-400">Liquidity Time-Lock</span>
                    <span className="flex items-center gap-1 text-emerald-400 font-medium">
                      <Lock className="w-3.5 h-3.5" /> {project.audit.liquidityLockedDays} Days (PinkLock)
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-[#0B0F19] rounded-lg border border-slate-800">
                    <span className="text-slate-400">Mint Function Disabled</span>
                    <span className="flex items-center gap-1 text-emerald-400 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Capped Supply
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-[#0B0F19] rounded-lg border border-slate-800">
                    <span className="text-slate-400">Transfer Taxes</span>
                    <span className="flex items-center gap-1 text-emerald-400 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {project.audit.maxTaxFeePct}% Max Fee
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-[#0B0F19] rounded-lg border border-slate-800">
                    <span className="text-slate-400">Ownership & Control</span>
                    <span className="text-amber-300 font-medium font-mono text-[11px]">
                      {project.audit.ownershipStatus}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-[#0B0F19] rounded-lg border border-slate-800">
                    <span className="text-slate-400">Proxy Architecture</span>
                    <span className="text-slate-200 font-mono text-[11px]">
                      {project.audit.proxyStandard}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-[#0B0F19] rounded-lg border border-slate-800">
                    <span className="text-slate-400">BscScan Code Verification</span>
                    <a
                      href={`https://bscscan.com/address/${project.audit.contractAddress}#code`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-amber-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
                    >
                      <span>Verified Bytecode</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Links */}
        <div className="p-4 bg-[#080C14] border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-4">
            <a
              href={project.website}
              target="_blank"
              rel="noreferrer"
              className="hover:text-amber-400 transition-colors"
            >
              Website
            </a>
            <span>·</span>
            <a
              href={project.twitter}
              target="_blank"
              rel="noreferrer"
              className="hover:text-amber-400 transition-colors"
            >
              Twitter
            </a>
            <span>·</span>
            <a
              href={project.telegram}
              target="_blank"
              rel="noreferrer"
              className="hover:text-amber-400 transition-colors"
            >
              Telegram
            </a>
            <span>·</span>
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="hover:text-amber-400 transition-colors"
            >
              GitHub
            </a>
          </div>

          <div className="font-mono text-[11px] text-slate-500">
            Contract: {project.contractAddress.slice(0, 10)}...{project.contractAddress.slice(-6)}
          </div>
        </div>
      </div>
    </div>
  );
};
