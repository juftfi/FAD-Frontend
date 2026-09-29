import React, { useState } from 'react';
import {
  FileCode,
  Copy,
  Check,
  BookOpen,
  Terminal,
  Cpu,
  Layers,
  ShieldCheck,
  ExternalLink,
  Code2
} from 'lucide-react';

export const DeveloperDocs: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeDocSection, setActiveDocSection] = useState<'interfaces' | 'sdk' | 'deployment'>('interfaces');

  const copyCode = (key: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const interfacesCode = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title ILaunchpadPool
 * @notice Standard interface for FAD BSC pools with EIP-1167 minimal proxy clone support.
 */
interface ILaunchpadPool {
    event TokensPledged(address indexed backer, uint256 amountBnb, uint256 timestamp);
    event PoolFinalized(uint256 totalRaisedBnb, uint256 totalTokensSold, uint256 timestamp);
    event RefundClaimed(address indexed backer, uint256 refundAmountBnb);

    function initialize(
        address tokenAddress,
        uint256 softCapBnb,
        uint256 hardCapBnb,
        uint256 tokenPriceBnb,
        uint256 maxAllocationPerWalletBnb,
        uint256 startTime,
        uint256 endTime,
        address vestingVaultAddress
    ) external;

    function pledgeAllocation() external payable;
    function finalizePool() external;
    function claimRefund() external;
    function calculateUserShare(address backer) external view returns (uint256 tokens, uint256 refundBnb);
    function isFairLaunch() external view returns (bool);
}`;

  const vestingVaultCode = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title IVestingVault
 * @notice Linear streaming vesting vault with customizable cliff and second-by-second release.
 */
interface IVestingVault {
    struct VestingSchedule {
        uint256 totalAmount;
        uint256 tgeUnlockPct;
        uint256 cliffDuration;
        uint256 vestingDuration;
        uint256 startTime;
        uint256 releasedAmount;
    }

    event TokensClaimed(address indexed beneficiary, uint256 amountClaimed);

    function createVestingSchedule(
        address beneficiary,
        uint256 totalAmount,
        uint256 tgeUnlockPct,
        uint256 cliffDuration,
        uint256 vestingDuration,
        uint256 startTime
    ) external;

    function claimVestedTokens() external returns (uint256 amountReleased);
    function computeReleasableAmount(address beneficiary) external view returns (uint256);
    function getVestingSchedule(address beneficiary) external view returns (VestingSchedule memory);
}`;

  const sdkCode = `import { ethers } from "ethers";
import { FADLaunchpadClient } from "@fad/launchpad-sdk";

// Initialize BSC Provider
const provider = new ethers.JsonRpcProvider("https://bsc-dataseed.binance.org/");
const signer = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

// Instantiate FADLaunchpad Client
const client = new FADLaunchpadClient({
  network: "bsc-mainnet",
  signer: signer,
});

async function main() {
  console.log("Connected to BSC Mainnet via FAD SDK");

  // 1. Query Active IDO Pool
  const pool = await client.getPool("0x8b32A2bE5094fFA44E89736c92dFdE68B8808A64");
  console.log(\`Pool Status: \${pool.status}, Raised: \${ethers.formatEther(pool.raisedBnb)} BNB\`);

  // 2. Pledge BNB into Fair Launch Overflow Pool
  const tx = await client.pledgeAllocation({
    poolAddress: pool.address,
    amountBnb: ethers.parseEther("1.5"),
    maxSlippageBps: 50, // Anti-bot protection
  });
  await tx.wait();
  console.log(\`Pledge successful: \${tx.hash}\`);

  // 3. Monitor Streaming Vesting Balance
  const claimable = await client.getClaimableTokens(pool.address, signer.address);
  console.log(\`Available to stream claim: \${claimable.toString()} tokens\`);
}

main().catch(console.error);`;

  const hardhatDeployCode = `import { ethers, upgrades } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying FAD UUPS Factory with deployer:", deployer.address);

  // 1. Deploy Implementation Logic Contract
  const LaunchpadImplementation = await ethers.getContractFactory("FADLaunchpadPoolV1");
  const masterLogic = await LaunchpadImplementation.deploy();
  await masterLogic.waitForDeployment();
  console.log("Master Logic deployed at:", await masterLogic.getAddress());

  // 2. Deploy EIP-1167 Minimal Proxy Factory
  const CloneFactory = await ethers.getContractFactory("FADCloneFactory");
  const factory = await upgrades.deployProxy(CloneFactory, [await masterLogic.getAddress()], {
    kind: "uups",
  });
  await factory.waitForDeployment();
  console.log("FADCloneFactory UUPS Proxy deployed at:", await factory.getAddress());
}

main();`;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#0F172A] via-[#151D2F] to-[#0F172A] border border-slate-800 shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-medium border border-amber-500/30">
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          <span>Developer Suite · Solidity Interfaces, SDK & Onboarding Guide</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
          Developer Onboarding & <span className="text-amber-400">Smart Contract APIs</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
          Integrate your decentralized application directly into the FAD ecosystem. Standardized Solidity interfaces for EIP-1167 clones, streaming vesting vaults, and the official TypeScript SDK.
        </p>
      </div>

      {/* Navigation sub-tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveDocSection('interfaces')}
          className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors ${
            activeDocSection === 'interfaces'
              ? 'bg-amber-400 text-slate-950 font-bold'
              : 'text-slate-400 hover:text-white bg-[#0F172A]'
          }`}
        >
          Solidity Interfaces
        </button>
        <button
          onClick={() => setActiveDocSection('sdk')}
          className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors ${
            activeDocSection === 'sdk'
              ? 'bg-amber-400 text-slate-950 font-bold'
              : 'text-slate-400 hover:text-white bg-[#0F172A]'
          }`}
        >
          TypeScript SDK
        </button>
        <button
          onClick={() => setActiveDocSection('deployment')}
          className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors ${
            activeDocSection === 'deployment'
              ? 'bg-amber-400 text-slate-950 font-bold'
              : 'text-slate-400 hover:text-white bg-[#0F172A]'
          }`}
        >
          Hardhat / Foundry Scripts
        </button>
      </div>

      {/* SECTION 1: SOLIDITY INTERFACES */}
      {activeDocSection === 'interfaces' && (
        <div className="space-y-6">
          {/* Interface 1 */}
          <div className="p-5 bg-[#0F172A] border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-amber-400" />
                  <span>ILaunchpadPool.sol</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Core interface for pledging BNB, overflow calculations, and pool finalization.
                </p>
              </div>
              <button
                onClick={() => copyCode('launchpadPool', interfacesCode)}
                className="px-3 py-1.5 text-xs rounded bg-[#162032] hover:bg-slate-800 text-slate-300 border border-slate-700 hover:border-amber-400 transition-colors flex items-center gap-1.5"
              >
                {copiedKey === 'launchpadPool' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Solidity</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-4 bg-[#080C14] rounded-lg border border-slate-800/80 text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed select-all">
              {interfacesCode}
            </pre>
          </div>

          {/* Interface 2 */}
          <div className="p-5 bg-[#0F172A] border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-emerald-400" />
                  <span>IVestingVault.sol</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Streaming vesting vault interface for cliff and continuous release calculations.
                </p>
              </div>
              <button
                onClick={() => copyCode('vestingVault', vestingVaultCode)}
                className="px-3 py-1.5 text-xs rounded bg-[#162032] hover:bg-slate-800 text-slate-300 border border-slate-700 hover:border-amber-400 transition-colors flex items-center gap-1.5"
              >
                {copiedKey === 'vestingVault' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Solidity</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-4 bg-[#080C14] rounded-lg border border-slate-800/80 text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed select-all">
              {vestingVaultCode}
            </pre>
          </div>
        </div>
      )}

      {/* SECTION 2: TYPESCRIPT SDK */}
      {activeDocSection === 'sdk' && (
        <div className="space-y-6">
          <div className="p-5 bg-[#0F172A] border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-sky-400" />
                  <span>@fad/launchpad-sdk Quickstart</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Interacting with pools, staking vaults, and streaming vesting using TypeScript.
                </p>
              </div>
              <button
                onClick={() => copyCode('sdkCode', sdkCode)}
                className="px-3 py-1.5 text-xs rounded bg-[#162032] hover:bg-slate-800 text-slate-300 border border-slate-700 hover:border-amber-400 transition-colors flex items-center gap-1.5"
              >
                {copiedKey === 'sdkCode' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Script</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-3 bg-[#080C14] rounded-lg border border-slate-800 font-mono text-xs text-amber-300">
              npm install @fad/launchpad-sdk ethers@^6.0.0
            </div>

            <pre className="p-4 bg-[#080C14] rounded-lg border border-slate-800/80 text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed select-all">
              {sdkCode}
            </pre>
          </div>
        </div>
      )}

      {/* SECTION 3: DEPLOYMENT SCRIPTS */}
      {activeDocSection === 'deployment' && (
        <div className="space-y-6">
          <div className="p-5 bg-[#0F172A] border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-purple-400" />
                  <span>scripts/deploy-uups-factory.ts</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Hardhat script deploying the minimal proxy clone factory with OpenZeppelin UUPS proxy support.
                </p>
              </div>
              <button
                onClick={() => copyCode('hardhatDeploy', hardhatDeployCode)}
                className="px-3 py-1.5 text-xs rounded bg-[#162032] hover:bg-slate-800 text-slate-300 border border-slate-700 hover:border-amber-400 transition-colors flex items-center gap-1.5"
              >
                {copiedKey === 'hardhatDeploy' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Hardhat</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-3 bg-[#080C14] rounded-lg border border-slate-800 font-mono text-xs text-emerald-300">
              npx hardhat run scripts/deploy-uups-factory.ts --network bscMainnet
            </div>

            <pre className="p-4 bg-[#080C14] rounded-lg border border-slate-800/80 text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed select-all">
              {hardhatDeployCode}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
