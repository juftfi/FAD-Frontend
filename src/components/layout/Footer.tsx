import React from 'react';
import { ExternalLink, ShieldCheck, Flame, GitFork, BookOpen } from 'lucide-react';
import { GAS_METRICS } from '../../data/mockData';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="w-full border-t border-[#1E293B] bg-[#070A10] text-slate-400 text-xs py-10 pb-24 lg:pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Brand & mission */}
          <div className="space-y-3">
            <div className="font-display text-lg font-bold text-white">
              <span className="text-amber-500">FAD</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Binance Smart Chain tier-governed launchpad and decentralized liquidity engine. Verified by CertiK and PeckShield with automated streaming vesting and gas-optimized minimal proxy clones.
            </p>
            <div className="flex items-center gap-3 pt-1 text-slate-400">
              <span className="flex items-center gap-1.5 text-[11px] text-amber-400 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                BSC Gas: {GAS_METRICS.standardGwei} Gwei
              </span>
              <span>·</span>
              <span className="text-[11px] text-slate-400 font-mono">
                BNB: ${GAS_METRICS.bnbPriceUsd}
              </span>
            </div>
          </div>

          {/* Col 2: Launchpad Protocols */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-white uppercase tracking-wider">
              Launchpad
            </div>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => setActiveTab('launchpad')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Active IDO Pools
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('fairlaunch')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Fair Launch Mechanisms
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('staking')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Tiered Staking Vaults
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('vesting')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Streaming Vesting Schedules
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('milestones')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Milestone Escrow Vaults
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Architecture & Security */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-white uppercase tracking-wider">
              Security & Contracts
            </div>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => setActiveTab('audit')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Security Audit Reports
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('contracts')}
                  className="hover:text-amber-400 transition-colors"
                >
                  ERC-1967 UUPS & Cross-Chain
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('factory')}
                  className="hover:text-amber-400 transition-colors"
                >
                  EIP-1167 Minimal Proxy Factory
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('governance')}
                  className="hover:text-amber-400 transition-colors"
                >
                  FAD DAO Governance
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('docs')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Developer SDK & APIs
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: BSC Ecosystem Links */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-white uppercase tracking-wider">
              Ecosystem
            </div>
            <ul className="space-y-1.5 text-xs">
              <li>
                <a
                  href="https://bscscan.com"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1 hover:text-amber-400 transition-colors"
                >
                  <span>BscScan Verified Contracts</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://pancakeswap.finance"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1 hover:text-amber-400 transition-colors"
                >
                  <span>PancakeSwap v3 Liquidity</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://certik.com"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1 hover:text-amber-400 transition-colors"
                >
                  <span>CertiK Security Scoreboard</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://layerzero.network"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1 hover:text-amber-400 transition-colors"
                >
                  <span>LayerZero Omnichain Endpoints</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#1E293B] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} FAD Ecosystem. Binance Smart Chain Native.
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setActiveTab('docs')} className="hover:text-slate-300 transition-colors">
              Documentation
            </button>
            <span>·</span>
            <button onClick={() => setActiveTab('audit')} className="hover:text-slate-300 transition-colors">
              Security
            </button>
            <span>·</span>
            <button onClick={() => setActiveTab('governance')} className="hover:text-slate-300 transition-colors">
              DAO Quorum
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
