import React, { useState } from 'react';
import { useWeb3 } from '../../context/Web3Context';
import { STAKING_TIERS } from '../../data/mockData';
import {
  Trophy,
  ShieldCheck,
  Lock,
  Flame,
  ArrowRight,
  TrendingUp,
  Percent,
  CheckCircle,
  HelpCircle,
  Coins,
  Sparkles,
  Zap,
  Clock,
  ExternalLink
} from 'lucide-react';

export const TieredStakingView: React.FC = () => {
  const {
    stakedFad,
    fadBalance,
    userTier,
    currentTierInfo,
    nextTierInfo,
    pendingYieldFad,
    stakeFad,
    unstakeFad,
    harvestYield
  } = useWeb3();

  const [stakeAmount, setStakeAmount] = useState<string>('2500');
  const [unstakeAmount, setUnstakeAmount] = useState<string>('');
  const [activeAction, setActiveAction] = useState<'stake' | 'unstake'>('stake');
  const [calculatorFad, setCalculatorFad] = useState<number>(10000);
  const [actionFeedback, setActionFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const handleStake = () => {
    const val = parseFloat(stakeAmount) || 0;
    const res = stakeFad(val);
    setActionFeedback(res);
    setTimeout(() => setActionFeedback(null), 4000);
  };

  const handleUnstake = () => {
    const val = parseFloat(unstakeAmount) || 0;
    const res = unstakeFad(val);
    setActionFeedback(res);
    setTimeout(() => setActionFeedback(null), 4000);
  };

  // Calculator logic
  const calcTier = STAKING_TIERS.slice().reverse().find((t) => calculatorFad >= t.fadRequired) || STAKING_TIERS[0];
  const estimatedAllocationBnb = (calcTier.weightMultiplier * 0.4).toFixed(2);

  // Progress to next tier
  const progressToNext = nextTierInfo
    ? Math.min(100, (stakedFad / nextTierInfo.fadRequired) * 100)
    : 100;

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner & Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#0F172A] via-[#131D31] to-[#0F172A] border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-medium border border-amber-500/30">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>FAD Tier Protocol · Guaranteed Allocation Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
            Stake $FAD, Unlock <span className="text-amber-400">Guaranteed Allocations</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Our 5-tier staking system ensures transparent allocation weights without gas wars. Lock tokens to harvest high APYs and unlock guaranteed private & public rounds.
          </p>
        </div>

        {/* User Active Tier Pill Card */}
        <div className="p-4 sm:p-5 bg-[#0B0F19] rounded-xl border border-amber-500/30 shrink-0 space-y-3 min-w-[260px]">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Your Active Tier</span>
            <span
              className="text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider"
              style={{
                backgroundColor: `${currentTierInfo?.color || '#D97706'}20`,
                color: currentTierInfo?.color || '#D97706'
              }}
            >
              {userTier}
            </span>
          </div>

          <div>
            <div className="text-2xl font-bold font-mono text-white tabular-nums">
              {stakedFad.toLocaleString()} <span className="text-amber-400 text-sm font-sans">$FAD</span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              Weight: <span className="font-semibold text-amber-300">{currentTierInfo?.poolWeight || 'None'}</span>
            </div>
          </div>

          {nextTierInfo && (
            <div className="space-y-1 pt-1 border-t border-slate-800">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Next: {nextTierInfo.name}</span>
                <span className="font-mono text-amber-400">{progressToNext.toFixed(0)}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full"
                  style={{ width: `${progressToNext}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Real-time Yield & Staking Vault Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Staking Action Terminal */}
        <div className="lg:col-span-2 p-6 bg-[#0F172A] border border-slate-800 rounded-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveAction('stake')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  activeAction === 'stake'
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Stake $FAD
              </button>
              <button
                onClick={() => setActiveAction('unstake')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  activeAction === 'unstake'
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Unstake
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Available: <span className="font-mono text-amber-400 font-semibold">{fadBalance.toLocaleString()} $FAD</span></span>
              <a
                href="https://flap.sh/bnb/0xe21b7ff7ad61a69fcc979b563edd8b72c2b37777"
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 hover:text-amber-300 underline underline-offset-2 ml-1"
                title="Buy $FAD on Flap (BNB Chain)"
              >
                <span>Buy $FAD</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>

          {activeAction === 'stake' ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-300">
                  Amount to Lock in FAD Staking Vault
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0B0F19] border border-slate-700 rounded-lg text-white font-mono text-lg focus:outline-none focus:border-amber-400 tabular-nums"
                    placeholder="0"
                  />
                  <button
                    onClick={() => setStakeAmount(fadBalance.toString())}
                    className="absolute right-3 top-3 px-2.5 py-1 text-xs font-semibold bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 rounded"
                  >
                    MAX
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-2 pt-1">
                  {[500, 2500, 10000, 25000].map((tierVal) => (
                    <button
                      key={tierVal}
                      onClick={() => setStakeAmount(tierVal.toString())}
                      className="py-1 text-xs font-mono rounded bg-[#162032] hover:bg-slate-800 text-slate-300"
                    >
                      {tierVal.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              {actionFeedback && (
                <div
                  className={`p-3 rounded-lg text-xs ${
                    actionFeedback.success
                      ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {actionFeedback.message}
                </div>
              )}

              <div className="p-3 bg-[#0B0F19] rounded-lg border border-slate-800 text-xs space-y-1.5 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Lock Duration:</span>
                  <span className="font-semibold text-white">
                    {currentTierInfo?.lockDurationDays || 14} Days Lock Period
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Current Vault APY:</span>
                  <span className="font-semibold text-emerald-400 font-mono">
                    {currentTierInfo?.baseApy || 18.5}% APY
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Guaranteed Allocation:</span>
                  <span className="font-semibold text-amber-300">
                    {currentTierInfo?.guaranteedAllocation ? 'Yes (Guaranteed Pool)' : 'Lottery Whitelist'}
                  </span>
                </div>
              </div>

              <button
                onClick={handleStake}
                className="w-full py-3 font-semibold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-lg shadow-md transition-all text-sm"
              >
                Stake $FAD into Vault
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-300">
                  Amount to Unstake
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={unstakeAmount}
                    onChange={(e) => setUnstakeAmount(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0B0F19] border border-slate-700 rounded-lg text-white font-mono text-lg focus:outline-none focus:border-amber-400 tabular-nums"
                    placeholder="0"
                  />
                  <button
                    onClick={() => setUnstakeAmount(stakedFad.toString())}
                    className="absolute right-3 top-3 px-2.5 py-1 text-xs font-semibold bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 rounded"
                  >
                    MAX
                  </button>
                </div>
              </div>

              {actionFeedback && (
                <div
                  className={`p-3 rounded-lg text-xs ${
                    actionFeedback.success
                      ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {actionFeedback.message}
                </div>
              )}

              <div className="p-3 bg-[#0B0F19] rounded-lg border border-slate-800 text-xs space-y-1.5 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Currently Staked:</span>
                  <span className="font-mono text-white font-bold">{stakedFad.toLocaleString()} $FAD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Early Unstaking Penalty:</span>
                  <span className="font-mono text-emerald-400">0% (Lock Expired)</span>
                </div>
              </div>

              <button
                onClick={handleUnstake}
                className="w-full py-3 font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-all text-sm"
              >
                Withdraw $FAD to Wallet
              </button>
            </div>
          )}
        </div>

        {/* Right Col: Live Yield Harvesting & APY Counter */}
        <div className="p-6 bg-[#0F172A] border border-slate-800 rounded-xl flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Staking Rewards</h3>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <div className="p-4 bg-[#0B0F19] rounded-lg border border-slate-800 text-center space-y-1">
              <div className="text-[11px] text-slate-400">Pending Staking Yield</div>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-400 tabular-nums">
                {pendingYieldFad.toFixed(3)}
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                ≈ ${(pendingYieldFad * 0.25).toFixed(2)} USD
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Vault APY</span>
                <span className="font-mono text-emerald-400 font-semibold">{currentTierInfo?.baseApy || 18.5}%</span>
              </div>
              <div className="flex justify-between">
                <span>Compounding Cadence</span>
                <span className="text-slate-200">Real-Time Continuous</span>
              </div>
              <div className="flex justify-between">
                <span>Yield Token</span>
                <span className="text-amber-400 font-semibold">$FAD (BEP-20)</span>
              </div>
            </div>
          </div>

          <button
            onClick={harvestYield}
            disabled={pendingYieldFad <= 0}
            className="w-full py-3 font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-40 rounded-lg transition-colors text-sm shadow-md"
          >
            Harvest Yield
          </button>
        </div>
      </div>

      {/* The 5 FAD Tiers Matrix */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold font-display text-white">
            FAD Tier Architecture
          </h2>
          <p className="text-xs text-slate-400">
            Higher tiers receive exponential allocation multipliers and zero overflow haircut.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {STAKING_TIERS.map((tier) => {
            const isCurrent = userTier === tier.id;
            return (
              <div
                key={tier.id}
                className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                  isCurrent
                    ? 'bg-[#151D2F] border-amber-500/60 shadow-lg shadow-amber-500/10 ring-1 ring-amber-400/40'
                    : 'bg-[#0F172A] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className="text-[11px] font-bold px-2 py-0.5 rounded uppercase tracking-wider"
                      style={{ backgroundColor: `${tier.color}20`, color: tier.color }}
                    >
                      {tier.name.split(' ')[0]}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-bold">
                        ACTIVE
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white">{tier.name}</h3>
                    <div className="text-xs font-mono font-bold text-amber-400 mt-0.5">
                      {tier.fadRequired.toLocaleString()} $FAD
                    </div>
                  </div>

                  <div className="p-2.5 bg-[#0B0F19] rounded-lg border border-slate-800 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Multiplier:</span>
                      <span className="font-semibold text-white">{tier.weightMultiplier}x</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Guaranteed:</span>
                      <span className="font-semibold text-amber-300">
                        {tier.guaranteedAllocation ? 'Yes' : 'Lottery'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Staking APY:</span>
                      <span className="font-mono text-emerald-400 font-semibold">{tier.baseApy}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Lock:</span>
                      <span className="text-slate-300">{tier.lockDurationDays} Days</span>
                    </div>
                  </div>

                  <ul className="space-y-1.5 text-[11px] text-slate-400 pt-1">
                    {tier.perks.slice(0, 3).map((perk, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => {
                    setStakeAmount(tier.fadRequired.toString());
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  }}
                  className={`mt-4 w-full py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    isCurrent
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-[#162032] hover:bg-slate-800 text-slate-200'
                  }`}
                >
                  {isCurrent ? 'Current Tier' : `Stake for ${tier.name.split(' ')[0]}`}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tier Multiplier & Allocation Calculator */}
      <div className="p-6 bg-[#0F172A] border border-slate-800 rounded-xl space-y-4">
        <div>
          <h3 className="text-base font-bold font-display text-white">
            Guaranteed Allocation Calculator
          </h3>
          <p className="text-xs text-slate-400">
            Estimate your guaranteed BNB allocation cap across upcoming IDO launches.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="space-y-3">
            <label className="text-xs font-medium text-slate-300">
              Simulate Staked $FAD: <span className="font-mono text-amber-400 font-bold">{calculatorFad.toLocaleString()} $FAD</span>
            </label>
            <input
              type="range"
              min="0"
              max="60000"
              step="500"
              value={calculatorFad}
              onChange={(e) => setCalculatorFad(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>0</span>
              <span>10,000</span>
              <span>25,000</span>
              <span>50,000+</span>
            </div>
          </div>

          <div className="p-4 bg-[#0B0F19] rounded-xl border border-slate-800 grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-[11px] text-slate-400">Tier Achieved</div>
              <div className="font-bold text-sm text-white mt-1">{calcTier.name.split(' ')[0]}</div>
            </div>
            <div className="border-x border-slate-800">
              <div className="text-[11px] text-slate-400">Pool Weight</div>
              <div className="font-mono font-bold text-sm text-amber-400 mt-1">{calcTier.weightMultiplier}x</div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400">Est. Pool Cap</div>
              <div className="font-mono font-bold text-sm text-emerald-400 mt-1">{estimatedAllocationBnb} BNB</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
