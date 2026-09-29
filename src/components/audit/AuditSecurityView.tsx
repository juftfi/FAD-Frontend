import React, { useState } from 'react';
import { useWeb3 } from '../../context/Web3Context';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertTriangle,
  Lock,
  ExternalLink,
  FileText,
  Percent,
  Cpu,
  RefreshCw,
  Code2
} from 'lucide-react';
import { Project } from '../../types';

export const AuditSecurityView: React.FC = () => {
  const { projects } = useWeb3();

  const [scanInput, setScanInput] = useState<string>(projects[0].contractAddress);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [selectedAuditProject, setSelectedAuditProject] = useState<Project>(projects[0]);

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      const match = projects.find(
        (p) => p.contractAddress.toLowerCase() === scanInput.toLowerCase().trim()
      );
      if (match) {
        setSelectedAuditProject(match);
      }
      setIsScanning(false);
    }, 1200);
  };

  const audit = selectedAuditProject.audit;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#0F172A] via-[#121E2C] to-[#0F172A] border border-slate-800 shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs font-medium border border-purple-500/30">
          <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
          <span>Binance Smart Chain Security Hardening & Audit Verification</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
          Institutional Security <span className="text-amber-400">& Smart Contract Audits</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
          Investor trust is the bedrock of decentralized finance. Every project on FAD undergoes comprehensive static analysis, automated bytecode decompilation, and formal verification by CertiK, PeckShield, Hacken, and FAD Security.
        </p>
      </div>

      {/* Live Security Scanner Terminal */}
      <div className="p-6 bg-[#0F172A] border border-slate-800 rounded-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-base font-bold text-white">
              Instant On-Chain Contract Scanner
            </h2>
            <p className="text-xs text-slate-400">
              Paste any BSC BEP-20 token or proxy address to verify security parameters and audit certificates.
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Node: BSC Mainnet Archive RPC</span>
          </div>
        </div>

        {/* Input & Quick Fill */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={scanInput}
                onChange={(e) => setScanInput(e.target.value)}
                placeholder="Enter BEP-20 contract address (0x...)"
                className="w-full px-4 py-2.5 bg-[#0B0F19] border border-slate-700 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-amber-400"
              />
            </div>
            <button
              onClick={handleScan}
              disabled={isScanning}
              className="px-5 py-2.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap shadow-sm"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Scanning Bytecode...</span>
                </>
              ) : (
                <>
                  <Search className="w-3.5 h-3.5" />
                  <span>Run Security Audit Scan</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Select Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto text-xs text-slate-400">
            <span className="text-[11px] text-slate-500 whitespace-nowrap">Verified IDO Pools:</span>
            {projects.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setScanInput(p.contractAddress);
                  setSelectedAuditProject(p);
                }}
                className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors whitespace-nowrap ${
                  selectedAuditProject.id === p.id
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-[#162032] hover:bg-slate-800 text-slate-300'
                }`}
              >
                ${p.symbol} ({p.name})
              </button>
            ))}
          </div>
        </div>

        {/* Scan Results Card */}
        <div className="p-5 bg-[#0B0F19] border border-slate-800 rounded-xl space-y-6">
          {/* Header result */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-slate-900 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold font-display text-lg">
                {selectedAuditProject.symbol.slice(0, 3)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">
                    {selectedAuditProject.name}
                  </h3>
                  <span className="text-xs font-mono font-bold text-amber-400">
                    ${selectedAuditProject.symbol}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Auditor: <span className="font-semibold text-white">{audit.auditor}</span> · Verified: {audit.date}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-[11px] text-slate-500">Security Score</div>
                <div className="text-3xl font-extrabold font-mono text-emerald-400 tabular-nums">
                  {audit.score}<span className="text-base text-slate-400 font-normal">/100</span>
                </div>
              </div>

              <a
                href={audit.reportUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 text-xs font-semibold bg-[#162032] hover:bg-slate-800 text-amber-300 border border-amber-500/30 rounded-lg inline-flex items-center gap-1.5 transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Download Report</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* 8-Point Security Inspection Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {/* 1 */}
            <div className="p-3 bg-[#0F172A] rounded-lg border border-slate-800 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium text-slate-200">Reentrancy Protection</div>
                <div className="text-[11px] text-slate-500">OpenZeppelin nonReentrant modifiers</div>
              </div>
              <span className="flex items-center gap-1 text-emerald-400 font-mono font-semibold">
                <CheckCircle2 className="w-4 h-4" /> Passed
              </span>
            </div>

            {/* 2 */}
            <div className="p-3 bg-[#0F172A] rounded-lg border border-slate-800 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium text-slate-200">Honeypot & Blacklist Trap</div>
                <div className="text-[11px] text-slate-500">Zero sell restrictions or hidden tax</div>
              </div>
              <span className="flex items-center gap-1 text-emerald-400 font-mono font-semibold">
                <CheckCircle2 className="w-4 h-4" /> Passed
              </span>
            </div>

            {/* 3 */}
            <div className="p-3 bg-[#0F172A] rounded-lg border border-slate-800 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium text-slate-200">Liquidity Time-Lock</div>
                <div className="text-[11px] text-slate-500">PancakeSwap LP locked with PinkLock</div>
              </div>
              <span className="flex items-center gap-1 text-emerald-400 font-mono font-semibold">
                <Lock className="w-4 h-4" /> {audit.liquidityLockedDays} Days
              </span>
            </div>

            {/* 4 */}
            <div className="p-3 bg-[#0F172A] rounded-lg border border-slate-800 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium text-slate-200">Mint Function Status</div>
                <div className="text-[11px] text-slate-500">Cannot arbitrarily inflate circulating supply</div>
              </div>
              <span className="flex items-center gap-1 text-emerald-400 font-mono font-semibold">
                <CheckCircle2 className="w-4 h-4" /> Disabled
              </span>
            </div>

            {/* 5 */}
            <div className="p-3 bg-[#0F172A] rounded-lg border border-slate-800 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium text-slate-200">Transfer Fees & Taxes</div>
                <div className="text-[11px] text-slate-500">Maximum buy / sell fee ceiling</div>
              </div>
              <span className="font-mono text-amber-300 font-semibold">
                {audit.maxTaxFeePct}% Max Fee
              </span>
            </div>

            {/* 6 */}
            <div className="p-3 bg-[#0F172A] rounded-lg border border-slate-800 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium text-slate-200">Ownership & Privileges</div>
                <div className="text-[11px] text-slate-500">Timelock multi-sig or DAO governance</div>
              </div>
              <span className="font-mono text-slate-200 font-semibold">
                {audit.ownershipStatus}
              </span>
            </div>

            {/* 7 */}
            <div className="p-3 bg-[#0F172A] rounded-lg border border-slate-800 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium text-slate-200">Proxy Upgrade Safety</div>
                <div className="text-[11px] text-slate-500">UUPS storage layout with collision protection</div>
              </div>
              <span className="font-mono text-purple-400 font-semibold">
                {audit.proxyStandard}
              </span>
            </div>

            {/* 8 */}
            <div className="p-3 bg-[#0F172A] rounded-lg border border-slate-800 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium text-slate-200">BscScan Bytecode Match</div>
                <div className="text-[11px] text-slate-500">Open-source Solidity verified on explorer</div>
              </div>
              <a
                href={`https://bscscan.com/address/${audit.contractAddress}#code`}
                target="_blank"
                rel="noreferrer"
                className="text-amber-400 hover:underline flex items-center gap-1 font-mono font-semibold"
              >
                <span>Verified 100%</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Partner Roster */}
      <div className="p-6 bg-[#0F172A] border border-slate-800 rounded-xl space-y-4">
        <h3 className="text-base font-bold font-display text-white">
          Certified Security Partners
        </h3>
        <p className="text-xs text-slate-400">
          Our independent security partners conduct deep manual line-by-line audits and automated fuzz testing.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
          <div className="p-4 bg-[#0B0F19] rounded-lg border border-slate-800 text-center space-y-1.5">
            <div className="text-sm font-bold text-white">CertiK</div>
            <div className="text-[11px] text-emerald-400 font-mono">Formal Verification</div>
            <div className="text-[10px] text-slate-500">Skynet Real-Time Monitoring</div>
          </div>

          <div className="p-4 bg-[#0B0F19] rounded-lg border border-slate-800 text-center space-y-1.5">
            <div className="text-sm font-bold text-white">PeckShield</div>
            <div className="text-[11px] text-emerald-400 font-mono">DeFi & Flash-Loan Audit</div>
            <div className="text-[10px] text-slate-500">Mempool Threat Detection</div>
          </div>

          <div className="p-4 bg-[#0B0F19] rounded-lg border border-slate-800 text-center space-y-1.5">
            <div className="text-sm font-bold text-white">Hacken</div>
            <div className="text-[11px] text-emerald-400 font-mono">Smart Contract Security</div>
            <div className="text-[10px] text-slate-500">Penetration Testing & Bug Bounty</div>
          </div>

          <div className="p-4 bg-[#0B0F19] rounded-lg border border-slate-800 text-center space-y-1.5">
            <div className="text-sm font-bold text-white">FAD Security</div>
            <div className="text-[11px] text-amber-400 font-mono">BSC Ecosystem Native</div>
            <div className="text-[10px] text-slate-500">Security Suite & Factory Compliance</div>
          </div>
        </div>
      </div>
    </div>
  );
};
