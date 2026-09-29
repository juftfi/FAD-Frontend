import React, { useState } from 'react';
import { Project, LaunchType } from '../../types';
import { useWeb3 } from '../../context/Web3Context';
import {
  Search,
  Filter,
  Flame,
  ShieldCheck,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Percent,
  CheckCircle2,
  Lock,
  PlusCircle
} from 'lucide-react';
import { ProjectDetailModal } from './ProjectDetailModal';

interface LaunchpadViewProps {
  setActiveTab: (tab: string) => void;
}

export const LaunchpadView: React.FC<LaunchpadViewProps> = ({ setActiveTab }) => {
  const { projects, userTier, currentTierInfo, bnbBalance } = useWeb3();

  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects = projects.filter((p) => {
    if (selectedStatus === 'live' && p.status !== 'live') return false;
    if (selectedStatus === 'upcoming' && p.status !== 'upcoming') return false;
    if (selectedStatus === 'ended' && p.status !== 'ended') return false;
    if (selectedStatus === 'fair-launch' && p.launchType !== 'fair-launch') return false;

    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.symbol.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Showcase with FAD Theme */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-[#0C111D] shadow-2xl">
        <div className="absolute inset-0">
          <img
            src="/images/brew_launchpad_hero_1790661362294.jpg"
            alt="FAD Hero"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
            className="w-full h-full object-cover object-center opacity-30 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080C14] via-[#080C14]/85 to-transparent" />
        </div>

        <div className="relative z-10 px-6 sm:px-10 py-10 sm:py-14 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>Binance Smart Chain · FAD Tiered Launchpad</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-white tracking-tight leading-tight">
            Distilling Next-Gen <span className="text-amber-400">Web3 Protocols</span> on BNB Chain.
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Guaranteed allocations with 5-tier staking, fair-launch overflow protection, automated streaming vesting schedules, and verified CertiK & PeckShield security audits.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('staking')}
              className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-lg shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
            >
              <span>Explore Staking Tiers</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('factory')}
              className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#162032] hover:bg-[#1E293B] border border-slate-700 hover:border-amber-400/40 rounded-lg transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4 text-amber-400" />
              <span>Launch a Project (EIP-1167)</span>
            </button>
          </div>
        </div>

        {/* Hero Bottom Metric Stats */}
        <div className="relative z-10 border-t border-slate-800/80 bg-[#070A10]/70 backdrop-blur-md px-6 sm:px-10 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <div className="text-[11px] text-slate-400">Total Funds Raised</div>
            <div className="text-base sm:text-lg font-bold font-mono text-amber-400 tabular-nums">
              $18,450,000+
            </div>
          </div>
          <div>
            <div className="text-[11px] text-slate-400">Projects Launched</div>
            <div className="text-base sm:text-lg font-bold font-mono text-white tabular-nums">
              42 Protocols
            </div>
          </div>
          <div>
            <div className="text-[11px] text-slate-400">Staked in Vaults</div>
            <div className="text-base sm:text-lg font-bold font-mono text-amber-300 tabular-nums">
              14,820,000 $FAD
            </div>
          </div>
          <div>
            <div className="text-[11px] text-slate-400">Audited Security</div>
            <div className="text-base sm:text-lg font-bold font-mono text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Status segmented tabs */}
        <div className="flex items-center gap-1 p-1 bg-[#0F172A] border border-slate-800 rounded-lg overflow-x-auto">
          {[
            { id: 'all', label: 'All Pools' },
            { id: 'live', label: 'Live IDO' },
            { id: 'fair-launch', label: 'Fair Launch' },
            { id: 'upcoming', label: 'Upcoming' },
            { id: 'ended', label: 'Completed' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                selectedStatus === tab.id
                  ? 'bg-amber-400 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Category Filter */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search token, symbol..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#0F172A] border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 text-xs bg-[#0F172A] border border-slate-800 rounded-lg text-slate-300 focus:outline-none focus:border-amber-400"
          >
            <option value="all">All Categories</option>
            <option value="DeFi">DeFi</option>
            <option value="AI & Data">AI & Data</option>
            <option value="Cross-Chain">Cross-Chain</option>
            <option value="Gaming & Metaverse">Gaming</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => {
          const progressPct = Math.min(100, (project.raisedBnb / project.hardCapBnb) * 100);
          const isOversubscribed = project.raisedBnb > project.hardCapBnb;

          return (
            <div
              key={project.id}
              className="group bg-[#0F172A] border border-slate-800 hover:border-amber-500/40 rounded-xl overflow-hidden transition-all duration-200 flex flex-col shadow-lg hover:shadow-amber-500/5"
            >
              {/* Card Banner */}
              <div className="relative h-28 w-full bg-slate-900 overflow-hidden">
                <img
                  src={project.banner}
                  alt={project.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] to-transparent" />

                {/* Status indicator */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  {project.status === 'live' && (
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/90 text-slate-950 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-pulse" />
                      Live IDO
                    </span>
                  )}
                  {project.status === 'upcoming' && (
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-sky-500/90 text-slate-950 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Upcoming
                    </span>
                  )}
                  {project.status === 'ended' && (
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-700 text-slate-300">
                      Closed
                    </span>
                  )}

                  {project.launchType === 'fair-launch' && (
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Fair Launch
                    </span>
                  )}
                  {project.launchType === 'overflow' && (
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      Overflow Pool
                    </span>
                  )}
                </div>

                {/* Audit Partner Badge */}
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-black/60 backdrop-blur-sm text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>{project.audit.auditor} {project.audit.score}</span>
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                {/* Logo & Title */}
                <div className="flex items-start gap-3">
                  <img
                    src={project.logo}
                    alt={project.name}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.src.endsWith('/logo.png')) {
                        target.src = '/logo.png';
                      }
                    }}
                    className="w-11 h-11 rounded-xl border border-amber-500/30 group-hover:border-amber-400 bg-slate-900 object-cover shrink-0 shadow-sm shadow-amber-500/10 transition-colors"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-semibold text-white truncate group-hover:text-amber-300 transition-colors">
                        {project.name}
                      </h3>
                      <span className="text-xs font-mono font-bold text-amber-400">
                        ${project.symbol}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">
                      {project.tagline}
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Raised Progress</span>
                    <span className="font-mono font-bold text-amber-400 tabular-nums">
                      {project.raisedBnb.toLocaleString()} BNB{' '}
                      <span className="text-slate-500 text-[10px]">({progressPct.toFixed(0)}%)</span>
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        isOversubscribed
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-300'
                          : 'bg-amber-400'
                      }`}
                      style={{ width: `${Math.min(100, progressPct)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>Soft: {project.softCapBnb} BNB</span>
                    <span>Hard: {project.hardCapBnb} BNB</span>
                  </div>
                </div>

                {/* Key metadata grid */}
                <div className="grid grid-cols-2 gap-2 text-xs p-2.5 bg-[#0B0F19] rounded-lg border border-slate-800/80">
                  <div>
                    <div className="text-[10px] text-slate-500">Token Price</div>
                    <div className="font-mono text-slate-200 tabular-nums">
                      ${project.tokenPriceUsd}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500">Max Allocation</div>
                    <div className="font-mono text-slate-200 tabular-nums">
                      {project.maxBuyBnb} BNB
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500">Vesting TGE</div>
                    <div className="font-mono text-slate-200">
                      {project.vesting.tgeUnlockPct}% Initial
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500">Liquidity Lock</div>
                    <div className="font-mono text-emerald-400 flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      <span>{project.liquidityLockMonths} Mo</span>
                    </div>
                  </div>
                </div>

                {/* Action button */}
                <button
                  onClick={() => setSelectedProject(project)}
                  className="w-full py-2.5 px-4 text-xs font-semibold rounded-lg bg-[#162032] hover:bg-amber-400 hover:text-slate-950 text-slate-200 border border-slate-700 hover:border-amber-400 transition-all flex items-center justify-center gap-2 group-hover:bg-amber-400 group-hover:text-slate-950"
                >
                  <span>{project.status === 'live' ? 'Participate & Claim' : 'View Project Details'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          setActiveTab={setActiveTab}
        />
      )}
    </div>
  );
};
