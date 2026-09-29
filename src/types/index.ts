export type NetworkType = 'bsc-mainnet' | 'bsc-testnet';

export type TierLevel = 'None' | 'Copper' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';

export interface StakingTier {
  id: TierLevel;
  name: string;
  fadRequired: number;
  weightMultiplier: number;
  guaranteedAllocation: boolean;
  poolWeight: string;
  lockDurationDays: number;
  baseApy: number;
  color: string;
  badge: string;
  perks: string[];
}

export type LaunchType = 'standard' | 'fair-launch' | 'overflow' | 'private';

export type ProjectStatus = 'upcoming' | 'live' | 'ended' | 'vesting';

export interface Milestone {
  id: string;
  title: string;
  description: string;
  percentageRelease: number;
  amountBnb: number;
  dueDate: string;
  status: 'released' | 'under_review' | 'pending' | 'disputed';
  verificationHash?: string;
  approvalVotesYes: number;
  approvalVotesNo: number;
  userVoted?: 'yes' | 'no';
}

export interface SecurityAudit {
  auditor: 'CertiK' | 'PeckShield' | 'Hacken' | 'FAD Security';
  date: string;
  score: number; // 0-100
  reportUrl: string;
  criticalIssues: number;
  mediumIssues: number;
  lowIssues: number;
  reentrancyProtected: boolean;
  honeypotImmune: boolean;
  liquidityLockedDays: number;
  mintDisabled: boolean;
  maxTaxFeePct: number;
  ownershipStatus: 'Renounced' | 'Multi-Sig Timelock' | 'DAO Controlled';
  proxyStandard: 'ERC-1967 UUPS' | 'ERC-2535 Diamond' | 'Immutable';
  contractAddress: string;
  verifiedOnBscScan: boolean;
}

export interface VestingSchedule {
  tgeUnlockPct: number; // e.g. 20%
  cliffDurationDays: number; // e.g. 30 days
  vestingDurationDays: number; // e.g. 180 days
  claimInterval: 'stream' | 'daily' | 'monthly';
  totalTokensAllocated: number;
  tokensClaimed: number;
  startTime: number; // unix timestamp in ms
}

export interface Project {
  id: string;
  name: string;
  symbol: string;
  tagline: string;
  description: string;
  logo: string;
  banner: string;
  launchType: LaunchType;
  status: ProjectStatus;
  tokenPriceBnb: number; // in BNB
  tokenPriceUsd: number;
  softCapBnb: number;
  hardCapBnb: number;
  raisedBnb: number;
  totalTokensSale: number;
  minBuyBnb: number;
  maxBuyBnb: number;
  participantsCount: number;
  startTime: string;
  endTime: string;
  dexPair: string;
  liquidityLockPct: number;
  liquidityLockMonths: number;
  contractAddress: string;
  website: string;
  twitter: string;
  telegram: string;
  github: string;
  antiSniperBotActive: boolean;
  maxTxPerBlock: number;
  audit: SecurityAudit;
  milestones: Milestone[];
  vesting: VestingSchedule;
  category: 'DeFi' | 'AI & Data' | 'Gaming & Metaverse' | 'Cross-Chain' | 'Infrastructure';
}

export interface Proposal {
  id: string;
  number: number;
  title: string;
  proposer: string;
  description: string;
  category: 'Milestone Release' | 'Protocol Parameter' | 'Treasury Allocation' | 'Tier Upgrade';
  status: 'active' | 'passed' | 'rejected' | 'queued';
  votesFor: number;
  votesAgainst: number;
  votesAbstain: number;
  quorumPct: number;
  minQuorumPct: number;
  startDate: string;
  endDate: string;
  executionDelayHours: number;
  hasUserVoted?: 'for' | 'against' | 'abstain';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: 'ido' | 'vesting' | 'governance' | 'security' | 'system';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface GasMetric {
  standardGwei: number;
  fastGwei: number;
  instantGwei: number;
  bnbPriceUsd: number;
  estimatedStandardClaimUsd: number;
  estimatedCloneDeployUsd: number;
  standardDeployGasUnits: number;
  eip1167CloneGasUnits: number;
}
