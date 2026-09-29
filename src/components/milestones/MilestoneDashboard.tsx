import React, { useState } from 'react';
import { useWeb3 } from '../../context/Web3Context';
import {
  Vote,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  Lock,
  Unlock,
  AlertTriangle,
  PieChart,
  HelpCircle
} from 'lucide-react';
import { Project, Milestone } from '../../types';

export const MilestoneDashboard: React.FC = () => {
  const { projects, voteMilestone, userTier } = useWeb3();

  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0].id);

  const activeProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const totalMilestones = activeProject.milestones.length;
  const releasedMilestones = activeProject.milestones.filter((m) => m.status === 'released').length;
  const underReviewMilestones = activeProject.milestones.filter((m) => m.status === 'under_review').length;

  const totalBnbInEscrow = activeProject.milestones.reduce((acc, m) => acc + m.amountBnb, 0);
  const releasedBnb = activeProject.milestones
    .filter((m) => m.status === 'released')
    .reduce((acc, m) => acc + m.amountBnb, 0);

  const lockedBnb = totalBnbInEscrow - releasedBnb;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#0F172A] via-[#141C2B] to-[#0F172A] border border-slate-800 shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-medium border border-amber-500/30">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          <span>Binance Smart Chain Milestone Escrow & Investor Protection</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
          Transparent <span className="text-amber-400">Milestone Escrows</span> & Allocations
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
          To protect investor capital from rug-pulls or abandoned roadmaps, 100% of raised BNB is locked in decentralized multi-sig escrow contracts. Capital is released only when founders prove deliverables that are verified by community backer votes.
        </p>
      </div>

      {/* Project Selector Segmented Control */}
      <div className="flex items-center gap-2 p-1.5 bg-[#0F172A] border border-slate-800 rounded-xl overflow-x-auto">
        {projects.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelectedProjectId(p.id)}
            className={`flex items-center gap-2.5 px-4 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              selectedProjectId === p.id
                ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <img
              src={p.logo}
              alt={p.name}
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.endsWith('/logo.png')) {
                  target.src = '/logo.png';
                }
              }}
              className="w-5 h-5 rounded-md object-cover"
            />
            <span>{p.name} (${p.symbol})</span>
          </button>
        ))}
      </div>

      {/* Escrow Vault Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-[#0F172A] border border-slate-800 rounded-xl">
          <div className="text-[11px] text-slate-400">Total Escrow Funds</div>
          <div className="text-xl font-bold font-mono text-white tabular-nums mt-1">
            {totalBnbInEscrow} BNB
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            ≈ ${(totalBnbInEscrow * 600).toLocaleString()} USD
          </div>
        </div>

        <div className="p-4 bg-[#0F172A] border border-slate-800 rounded-xl">
          <div className="text-[11px] text-slate-400">Released to Founders</div>
          <div className="text-xl font-bold font-mono text-emerald-400 tabular-nums mt-1">
            {releasedBnb} BNB
          </div>
          <div className="text-[10px] text-slate-500">
            {((releasedBnb / (totalBnbInEscrow || 1)) * 100).toFixed(0)}% verified release
          </div>
        </div>

        <div className="p-4 bg-[#0F172A] border border-slate-800 rounded-xl">
          <div className="text-[11px] text-slate-400">Locked in Timelock</div>
          <div className="text-xl font-bold font-mono text-amber-400 tabular-nums mt-1">
            {lockedBnb} BNB
          </div>
          <div className="text-[10px] text-slate-500">
            Safeguarded in smart contract
          </div>
        </div>

        <div className="p-4 bg-[#0F172A] border border-slate-800 rounded-xl">
          <div className="text-[11px] text-slate-400">Milestone Progress</div>
          <div className="text-xl font-bold font-mono text-white tabular-nums mt-1">
            {releasedMilestones}/{totalMilestones} Completed
          </div>
          <div className="text-[10px] text-amber-300">
            {underReviewMilestones > 0 ? `${underReviewMilestones} In Community Review` : 'All caught up'}
          </div>
        </div>
      </div>

      {/* Fund Allocation Breakdown Chart & Transparency Matrix */}
      <div className="p-6 bg-[#0F172A] border border-slate-800 rounded-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white">
            Fund Allocation Transparency Breakdown
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            Pair: {activeProject.dexPair}
          </span>
        </div>

        {/* Visual Allocation Bar */}
        <div className="space-y-2">
          <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden flex">
            <div
              className="h-full bg-amber-400 hover:opacity-90 transition-opacity"
              style={{ width: `${activeProject.liquidityLockPct}%` }}
              title={`PancakeSwap v3 Liquidity: ${activeProject.liquidityLockPct}%`}
            />
            <div
              className="h-full bg-emerald-400 hover:opacity-90 transition-opacity"
              style={{ width: '15%' }}
              title="Audited Core Engineering: 15%"
            />
            <div
              className="h-full bg-sky-400 hover:opacity-90 transition-opacity"
              style={{ width: '10%' }}
              title="Marketing & Strategic Growth: 10%"
            />
            <div
              className="h-full bg-purple-400 hover:opacity-90 transition-opacity"
              style={{ width: '5%' }}
              title="DAO Reserve & Insurance: 5%"
            />
          </div>

          {/* Allocation Legend */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-400 shrink-0" />
              <div>
                <span className="text-slate-300 font-semibold">{activeProject.liquidityLockPct}% DEX Liquidity</span>
                <div className="text-[10px] text-slate-500">Locked {activeProject.liquidityLockMonths} Mo with PinkLock</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400 shrink-0" />
              <div>
                <span className="text-slate-300 font-semibold">15% Engineering</span>
                <div className="text-[10px] text-slate-500">Milestone Tranches</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-sky-400 shrink-0" />
              <div>
                <span className="text-slate-300 font-semibold">10% Ecosystem</span>
                <div className="text-[10px] text-slate-500">Cross-Chain & Users</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-purple-400 shrink-0" />
              <div>
                <span className="text-slate-300 font-semibold">5% Insurance Vault</span>
                <div className="text-[10px] text-slate-500">FAD Safety Fund</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Milestones Escrow Tranches List & Voting */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold font-display text-white">
            Milestone Release Schedule & Voting Gate
          </h2>
          <p className="text-xs text-slate-400">
            Holders and backers vote with their $FAD tier power. If a milestone is disputed and rejected, unspent funds are refunded.
          </p>
        </div>

        <div className="space-y-4">
          {activeProject.milestones.map((milestone, idx) => (
            <div
              key={milestone.id}
              className={`p-5 rounded-xl border transition-all ${
                milestone.status === 'under_review'
                  ? 'bg-[#151D2F] border-amber-500/50 shadow-lg'
                  : 'bg-[#0F172A] border-slate-800'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#0B0F19] text-amber-400 font-mono font-bold border border-slate-700 shrink-0 mt-0.5">
                    0{idx + 1}
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-white">
                      {milestone.title}
                    </h3>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Release Target: <span className="font-mono text-amber-400 font-semibold">{milestone.amountBnb} BNB</span> ({milestone.percentageRelease}% of raised capital) · Deadline: {milestone.dueDate}
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div>
                  {milestone.status === 'released' && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Released & Dispatched</span>
                    </span>
                  )}
                  {milestone.status === 'under_review' && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1.5 animate-pulse">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Voting in Progress</span>
                    </span>
                  )}
                  {milestone.status === 'pending' && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Locked in Escrow</span>
                    </span>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mt-3">
                {milestone.description}
              </p>

              {/* On-chain proof hash */}
              {milestone.verificationHash && (
                <div className="mt-3 p-2.5 bg-[#0B0F19] rounded-lg border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="text-[11px] text-slate-500">Deliverable Verification Hash:</span>
                    <span className="font-mono text-slate-300">{milestone.verificationHash}</span>
                  </div>
                  <a
                    href={`https://bscscan.com/tx/${milestone.verificationHash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-400 hover:underline flex items-center gap-1 text-[11px] font-mono"
                  >
                    <span>View on BscScan</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {/* Interactive Backer Voting */}
              {milestone.status === 'under_review' && (
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-xs text-slate-400">
                    Community Approval Tally:{' '}
                    <span className="font-mono font-bold text-emerald-400">
                      {milestone.approvalVotesYes.toLocaleString()} YES
                    </span>{' '}
                    / <span className="font-mono font-bold text-rose-400">{milestone.approvalVotesNo} NO</span>
                    <span className="text-slate-500 ml-2">
                      ({((milestone.approvalVotesYes / (milestone.approvalVotesYes + milestone.approvalVotesNo || 1)) * 100).toFixed(1)}% Consensus)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => voteMilestone(activeProject.id, milestone.id, 'yes')}
                      className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                        milestone.userVoted === 'yes'
                          ? 'bg-emerald-500 text-slate-950 font-bold'
                          : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                      }`}
                    >
                      {milestone.userVoted === 'yes' ? '✓ Voted Approved' : 'Vote Approve Release'}
                    </button>
                    <button
                      onClick={() => voteMilestone(activeProject.id, milestone.id, 'no')}
                      className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                        milestone.userVoted === 'no'
                          ? 'bg-rose-500 text-white font-bold'
                          : 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30'
                      }`}
                    >
                      {milestone.userVoted === 'no' ? '✓ Voted Dispute' : 'Dispute Deliverable'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
