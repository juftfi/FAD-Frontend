import React, { useState } from 'react';
import { useWeb3 } from '../../context/Web3Context';
import {
  Vote,
  CheckCircle2,
  XCircle,
  Clock,
  PlusCircle,
  HelpCircle,
  ExternalLink,
  Users,
  ShieldCheck,
  Zap,
  Percent
} from 'lucide-react';
import { Proposal } from '../../types';

export const GovernancePortal: React.FC = () => {
  const { proposals, voteProposal, createProposal, stakedFad, userTier } = useWeb3();

  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'passed' | 'queued'>('all');
  const [votingProposal, setVotingProposal] = useState<Proposal | null>(null);
  const [voteChoice, setVoteChoice] = useState<'for' | 'against' | 'abstain'>('for');
  const [useQuadraticVoting, setUseQuadraticVoting] = useState<boolean>(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  // New proposal form
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<Proposal['category']>('Milestone Release');

  const filteredProposals = proposals.filter((p) => {
    if (activeFilter === 'all') return true;
    return p.status === activeFilter;
  });

  const handleCastVote = () => {
    if (!votingProposal) return;
    voteProposal(votingProposal.id, voteChoice);
    setVotingProposal(null);
  };

  const handleCreateProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;
    createProposal(newTitle, newDesc, newCategory);
    setNewTitle('');
    setNewDesc('');
    setIsCreateModalOpen(false);
  };

  // Quadratic voting calculation: sqrt(stakedFad)
  const effectiveVotes = useQuadraticVoting
    ? Math.round(Math.sqrt(stakedFad || 100) * 10)
    : stakedFad || 100;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#0F172A] via-[#151D2F] to-[#0F172A] border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-300 text-xs font-medium border border-sky-500/30">
            <Vote className="w-3.5 h-3.5 text-sky-400" />
            <span>FAD DAO On-Chain Governance & Quadratic Voting</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
            Decentralized <span className="text-amber-400">Decision-Making Portal</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Every protocol upgrade, milestone escrow release, and tier multiplier is decided by community consensus. Quadratic voting ensures individual retail backers have an equitable voice alongside large holders.
          </p>
        </div>

        {/* Voting Power Box */}
        <div className="p-4 sm:p-5 bg-[#0B0F19] rounded-xl border border-slate-800 shrink-0 space-y-2.5 min-w-[240px]">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Your Voting Weight</span>
            <span className="font-semibold text-amber-400 font-mono">{userTier} Tier</span>
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            {effectiveVotes.toLocaleString()} <span className="text-xs font-sans text-amber-400">Votes</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-800">
            <span>Staked: {stakedFad.toLocaleString()} $FAD</span>
            <span className="text-amber-300">{useQuadraticVoting ? 'Quadratic √' : 'Linear 1:1'}</span>
          </div>
        </div>
      </div>

      {/* Controls & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Status filters */}
        <div className="flex items-center gap-1 p-1 bg-[#0F172A] border border-slate-800 rounded-lg overflow-x-auto">
          {['all', 'active', 'passed', 'queued'].map((status) => (
            <button
              key={status}
              onClick={() => setActiveFilter(status as any)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors whitespace-nowrap ${
                activeFilter === status
                  ? 'bg-amber-400 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {status} Proposals
            </button>
          ))}
        </div>

        {/* Quadratic switch & Create CTA */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setUseQuadraticVoting(!useQuadraticVoting)}
            className={`px-3 py-1.5 text-xs rounded-lg border transition-colors flex items-center gap-1.5 ${
              useQuadraticVoting
                ? 'bg-amber-500/15 border-amber-500/30 text-amber-300 font-medium'
                : 'bg-[#0F172A] border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Percent className="w-3.5 h-3.5" />
            <span>Quadratic Voting: {useQuadraticVoting ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Proposal</span>
          </button>
        </div>
      </div>

      {/* Proposals List */}
      <div className="space-y-4">
        {filteredProposals.map((prop) => {
          const totalVotes = prop.votesFor + prop.votesAgainst + prop.votesAbstain;
          const forPct = totalVotes > 0 ? (prop.votesFor / totalVotes) * 100 : 0;
          const againstPct = totalVotes > 0 ? (prop.votesAgainst / totalVotes) * 100 : 0;

          return (
            <div
              key={prop.id}
              className="p-5 bg-[#0F172A] border border-slate-800 hover:border-slate-700 rounded-xl space-y-4 transition-all"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    FIP-{prop.number}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Category: <span className="text-white font-medium">{prop.category}</span> · Proposer: {prop.proposer}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {prop.status === 'active' && (
                    <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Voting Active
                    </span>
                  )}
                  {prop.status === 'passed' && (
                    <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/30">
                      Passed & Executed
                    </span>
                  )}
                  {prop.status === 'queued' && (
                    <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30">
                      In Timelock Queue
                    </span>
                  )}
                </div>
              </div>

              {/* Title & Desc */}
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white hover:text-amber-300 transition-colors">
                  {prop.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {prop.description}
                </p>
              </div>

              {/* Voting Results Progress Bars */}
              <div className="p-3.5 bg-[#0B0F19] rounded-lg border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    Quorum: <span className="font-mono text-white font-semibold">{prop.quorumPct}%</span> (Min {prop.minQuorumPct}% required)
                  </span>
                  <span className="font-mono text-slate-400">
                    Total Votes: <span className="text-white font-semibold">{totalVotes.toLocaleString()}</span>
                  </span>
                </div>

                {/* Combined Progress bar */}
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-emerald-400"
                    style={{ width: `${forPct}%` }}
                    title={`FOR: ${forPct.toFixed(1)}%`}
                  />
                  <div
                    className="h-full bg-rose-500"
                    style={{ width: `${againstPct}%` }}
                    title={`AGAINST: ${againstPct.toFixed(1)}%`}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-emerald-400 font-semibold">
                    FOR: {prop.votesFor.toLocaleString()} ({forPct.toFixed(1)}%)
                  </span>
                  <span className="text-rose-400 font-semibold">
                    AGAINST: {prop.votesAgainst.toLocaleString()} ({againstPct.toFixed(1)}%)
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <div className="text-xs text-slate-500 font-mono">
                  Timeline: {prop.startDate} to {prop.endDate} · Timelock Delay: {prop.executionDelayHours}h
                </div>

                {prop.status === 'active' && (
                  <div>
                    {prop.hasUserVoted ? (
                      <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        You Voted: {prop.hasUserVoted.toUpperCase()}
                      </span>
                    ) : (
                      <button
                        onClick={() => setVotingProposal(prop)}
                        className="px-4 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-sm"
                      >
                        Cast Vote ({effectiveVotes} Votes)
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Cast Vote Modal */}
      {votingProposal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#0F172A] border border-slate-800 rounded-xl p-6 space-y-4 text-slate-100">
            <h3 className="text-base font-bold text-white">
              Cast Your Vote on FIP-{votingProposal.number}
            </h3>
            <p className="text-xs text-slate-300 line-clamp-2">
              {votingProposal.title}
            </p>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-400">Select Decision</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setVoteChoice('for')}
                  className={`py-2 text-xs font-bold rounded-lg border transition-colors ${
                    voteChoice === 'for'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                      : 'bg-[#0B0F19] border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  FOR
                </button>
                <button
                  type="button"
                  onClick={() => setVoteChoice('against')}
                  className={`py-2 text-xs font-bold rounded-lg border transition-colors ${
                    voteChoice === 'against'
                      ? 'bg-rose-500/20 border-rose-400 text-rose-300'
                      : 'bg-[#0B0F19] border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  AGAINST
                </button>
                <button
                  type="button"
                  onClick={() => setVoteChoice('abstain')}
                  className={`py-2 text-xs font-bold rounded-lg border transition-colors ${
                    voteChoice === 'abstain'
                      ? 'bg-slate-700/50 border-slate-500 text-slate-200'
                      : 'bg-[#0B0F19] border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  ABSTAIN
                </button>
              </div>
            </div>

            <div className="p-3 bg-[#0B0F19] rounded-lg border border-slate-800 text-xs space-y-1 text-slate-400">
              <div className="flex justify-between">
                <span>Effective Voting Power:</span>
                <span className="font-mono text-amber-400 font-bold">{effectiveVotes.toLocaleString()} Votes</span>
              </div>
              <div className="flex justify-between">
                <span>Method:</span>
                <span>{useQuadraticVoting ? 'Quadratic Calculation' : 'Linear Staked'}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setVotingProposal(null)}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCastVote}
                className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors"
              >
                Confirm Vote on BSC
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Proposal Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-[#0F172A] border border-slate-800 rounded-xl p-6 space-y-4 text-slate-100">
            <h3 className="text-base font-bold text-white">
              Create New FAD DAO Proposal
            </h3>
            <p className="text-xs text-slate-400">
              Proposals require Gold Tier (10,000+ $FAD staked) to submit. Once published, voting remains open for 5 days.
            </p>

            <form onSubmit={handleCreateProposal} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">Proposal Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#0B0F19] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="Milestone Release">Milestone Release</option>
                  <option value="Protocol Parameter">Protocol Parameter</option>
                  <option value="Treasury Allocation">Treasury Allocation</option>
                  <option value="Tier Upgrade">Tier Upgrade</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">Proposal Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FIP-17: Approve 200 BNB Escrow Release..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0B0F19] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">Full Rationale & On-Chain Specs</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe deliverables, transaction proof hashes, or parameter changes..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0B0F19] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors"
                >
                  Publish Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
