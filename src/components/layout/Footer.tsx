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
            <div className="flex items-center gap-2.5">
              <img
                src="/logo.png"
                alt="FAD Logo"
                className="h-8 w-8 rounded-md object-contain border border-amber-500/20"
              />
              <span className="font-display text-lg font-bold text-white">
                <span className="text-amber-500">FAD</span>
              </span>
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

            {/* Official Social & Purchase Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <a
                href="https://x.com/fadlaunch"
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0F172A] hover:bg-[#1E293B] border border-slate-800 hover:border-amber-400/50 text-slate-300 hover:text-white transition-all text-xs font-medium shadow-sm group"
                title="Follow FAD on X (@fadlaunch)"
              >
                <svg className="w-3.5 h-3.5 fill-current text-slate-400 group-hover:text-amber-400 transition-colors" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <span>X (@fadlaunch)</span>
                <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-slate-300" />
              </a>

              <a
                href="https://t.me/fadlaunch"
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0F172A] hover:bg-[#1E293B] border border-slate-800 hover:border-sky-400/50 text-slate-300 hover:text-white transition-all text-xs font-medium shadow-sm group"
                title="Join FAD Telegram (@fadlaunch)"
              >
                <svg className="w-3.5 h-3.5 fill-current text-sky-400 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.52 2.77-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .37z"/>
                </svg>
                <span>Telegram</span>
                <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-slate-300" />
              </a>

              <a
                href="https://flap.sh/"
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 hover:border-amber-400 text-amber-300 hover:text-amber-200 transition-all text-xs font-semibold shadow-sm group"
                title="Buy $FAD Token on Flap (BNB Chain)"
              >
                <span>Buy $FAD</span>
                <ExternalLink className="w-3 h-3 text-amber-400/80" />
              </a>
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
              <li className="pt-1 border-t border-slate-800/60">
                <a
                  href="https://x.com/fadlaunch"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1 text-slate-300 hover:text-amber-400 transition-colors"
                >
                  <svg className="w-3 h-3 fill-current text-slate-400" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  <span>X (@fadlaunch)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/fadlaunch"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1 text-slate-300 hover:text-sky-400 transition-colors"
                >
                  <svg className="w-3 h-3 fill-current text-sky-400" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.52 2.77-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .37z"/>
                  </svg>
                  <span>Telegram Community</span>
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
          <div className="flex items-center gap-3">
            <a
              href="https://x.com/fadlaunch"
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#0F172A] border border-slate-800 hover:border-amber-400 text-slate-400 hover:text-white transition-colors"
              title="Official X: https://x.com/fadlaunch"
            >
              <svg className="w-3 h-3 fill-current text-slate-300" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <span>X</span>
            </a>
            <a
              href="https://t.me/fadlaunch"
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#0F172A] border border-slate-800 hover:border-sky-400 text-slate-400 hover:text-white transition-colors"
              title="Official Telegram: https://t.me/fadlaunch"
            >
              <svg className="w-3 h-3 fill-current text-sky-400" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.52 2.77-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .37z"/>
              </svg>
              <span>Telegram</span>
            </a>
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
