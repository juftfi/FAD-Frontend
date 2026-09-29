import React, { useState } from 'react';
import {
  Waves,
  ShieldAlert,
  Percent,
  Calculator,
  Flame,
  CheckCircle2,
  Bot,
  RefreshCw,
  Coins,
  ArrowRight
} from 'lucide-react';

export const FairLaunchSimulator: React.FC = () => {
  // Simulator inputs
  const [hardCap, setHardCap] = useState<number>(500); // 500 BNB
  const [totalPledged, setTotalPledged] = useState<number>(1250); // 1250 BNB (250% oversubscribed)
  const [userPledge, setUserPledge] = useState<number>(2.5); // 2.5 BNB
  const [totalTokensForSale] = useState<number>(1000000); // 1,000,000 tokens

  // Calculate proportional overflow
  const isOverflow = totalPledged > hardCap;
  const overflowPercentage = ((totalPledged / hardCap) * 100).toFixed(1);

  // User share
  const userShareRatio = totalPledged > 0 ? userPledge / totalPledged : 0;
  const userAllocatedTokens = Math.round(userShareRatio * totalTokensForSale);
  const effectivePricePerTokenBnb = hardCap / totalTokensForSale;

  // Actual BNB consumed & refund
  const actualBnbSpent = isOverflow
    ? (userAllocatedTokens * effectivePricePerTokenBnb)
    : userPledge;

  const bnbRefunded = Math.max(0, userPledge - actualBnbSpent);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#0F172A] via-[#151D2F] to-[#0F172A] border border-slate-800 shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-medium border border-amber-500/30">
          <Waves className="w-3.5 h-3.5 text-amber-400" />
          <span>Binance Smart Chain Fair Launch & Overflow Protection</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
          Zero Gas Wars. <span className="text-amber-400">100% Proportional Fair Launches.</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
          Traditional token launches suffer from MEV bot front-running, high slippage, and predatory sniping. FAD fair launch mechanisms introduce anti-sniper block throttles and mathematical proportional overflow distribution.
        </p>
      </div>

      {/* Interactive Proportional Overflow Sandbox */}
      <div className="p-6 bg-[#0F172A] border border-slate-800 rounded-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">
              Interactive Overflow Math Simulator
            </h2>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/30">
            EIP-Proportional Overflow Standard
          </span>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Slider 1: Hard Cap */}
          <div className="space-y-2 p-3 bg-[#0B0F19] rounded-lg border border-slate-800">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Pool Hard Cap:</span>
              <span className="font-mono text-amber-400 font-bold">{hardCap} BNB</span>
            </div>
            <input
              type="range"
              min="100"
              max="1000"
              step="50"
              value={hardCap}
              onChange={(e) => setHardCap(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
            <div className="text-[10px] text-slate-500">Target funding target for project</div>
          </div>

          {/* Slider 2: Total Raised / Pledged */}
          <div className="space-y-2 p-3 bg-[#0B0F19] rounded-lg border border-slate-800">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Total Community Pledged:</span>
              <span className="font-mono text-white font-bold">{totalPledged} BNB</span>
            </div>
            <input
              type="range"
              min="100"
              max="2500"
              step="50"
              value={totalPledged}
              onChange={(e) => setTotalPledged(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
            <div className="text-[10px] text-slate-500">
              Subscription Rate:{' '}
              <span className="text-amber-400 font-mono font-semibold">{overflowPercentage}%</span>
            </div>
          </div>

          {/* Slider 3: User's Pledge */}
          <div className="space-y-2 p-3 bg-[#0B0F19] rounded-lg border border-slate-800">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Your Simulated Pledge:</span>
              <span className="font-mono text-emerald-400 font-bold">{userPledge} BNB</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="10.0"
              step="0.1"
              value={userPledge}
              onChange={(e) => setUserPledge(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
            <div className="text-[10px] text-slate-500">Max limit per wallet = 10 BNB</div>
          </div>
        </div>

        {/* Results Banner */}
        <div className="p-5 bg-[#0B0F19] border border-amber-500/30 rounded-xl grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-xs text-slate-400">Oversubscription</div>
            <div className="text-xl font-bold font-mono text-amber-400 tabular-nums mt-1">
              {overflowPercentage}%
            </div>
            <div className="text-[10px] text-slate-500">
              {isOverflow ? `${(totalPledged / hardCap).toFixed(2)}x Overflow` : 'Normal Fill'}
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-400">Your Token Allocation</div>
            <div className="text-xl font-bold font-mono text-white tabular-nums mt-1">
              {userAllocatedTokens.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-500">Guaranteed BEP-20 Share</div>
          </div>

          <div>
            <div className="text-xs text-slate-400">Actual BNB Spent</div>
            <div className="text-xl font-bold font-mono text-amber-300 tabular-nums mt-1">
              {actualBnbSpent.toFixed(3)} BNB
            </div>
            <div className="text-[10px] text-slate-500">Deducted from pledge</div>
          </div>

          <div>
            <div className="text-xs text-emerald-400 font-semibold">Automatic Refund</div>
            <div className="text-xl font-bold font-mono text-emerald-400 tabular-nums mt-1">
              {bnbRefunded.toFixed(3)} BNB
            </div>
            <div className="text-[10px] text-emerald-500">Instant return to wallet</div>
          </div>
        </div>

        {/* Mathematical Formula Breakdown */}
        <div className="p-4 bg-[#111827] rounded-lg border border-slate-800 font-mono text-xs text-slate-300 space-y-2">
          <div className="text-amber-400 font-bold text-[11px] uppercase tracking-wider">
            Smart Contract Overflow Algorithm:
          </div>
          <div className="p-2.5 bg-[#080C14] rounded border border-slate-800 overflow-x-auto text-[11px]">
            userTokens = (userPledgedBNB / totalPledgedBNB) * totalTokensForSale;<br />
            userSpentBNB = userTokens * (hardCapBNB / totalTokensForSale);<br />
            refundBNB = userPledgedBNB - userSpentBNB;
          </div>
        </div>
      </div>

      {/* 3 Pillars of Fair Launch Protection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 bg-[#0F172A] border border-slate-800 rounded-xl space-y-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Bot className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-white">
            Anti-Sniper Bot Shield
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Smart contract limits transactions to 1 per block per address. Employs a dynamic liquidity fee step-down curve on DEX initialization that penalizes automated front-running bots without affecting retail holders.
          </p>
          <div className="pt-1 text-[11px] text-amber-300 font-mono">
            • 20-block cooldown guard<br />
            • Sandwiched trade invalidation
          </div>
        </div>

        <div className="p-5 bg-[#0F172A] border border-slate-800 rounded-xl space-y-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Percent className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-white">
            Proportional Overflow
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            No rush, no high gas bids. You have a full 48-hour participation window. If the pool oversubscribes, every participant receives their mathematically fair share and unused BNB is automatically sent back.
          </p>
          <div className="pt-1 text-[11px] text-emerald-300 font-mono">
            • Zero gas bidding wars<br />
            • 100% fair distribution
          </div>
        </div>

        <div className="p-5 bg-[#0F172A] border border-slate-800 rounded-xl space-y-3">
          <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-white">
            Whale & Max Cap Restrictions
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Strict per-wallet caps prevent whales from cornering token supply. Soft cap guarantees project viability: if soft cap is not reached, 100% of contributed funds are immediately refundable with one click.
          </p>
          <div className="pt-1 text-[11px] text-sky-300 font-mono">
            • 2 - 5 BNB maximum cap<br />
            • 100% soft cap safety vault
          </div>
        </div>
      </div>
    </div>
  );
};
