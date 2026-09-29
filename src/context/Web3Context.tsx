import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Project, StakingTier, TierLevel, Proposal, NotificationItem, NetworkType } from '../types';
import { INITIAL_PROJECTS, STAKING_TIERS, INITIAL_PROPOSALS, INITIAL_NOTIFICATIONS } from '../data/mockData';
import confetti from 'canvas-confetti';

interface Web3ContextType {
  isConnected: boolean;
  address: string;
  walletName: string;
  network: NetworkType;
  bnbBalance: number;
  fadBalance: number;
  brewBalance: number; // alias
  stakedFad: number;
  stakedBrew: number; // alias
  userTier: TierLevel;
  currentTierInfo: StakingTier | null;
  nextTierInfo: StakingTier | null;
  pendingYieldFad: number;
  pendingYieldBrew: number; // alias
  stakedTimestamp: number;
  userContributions: Record<string, number>; // projectId -> BNB contributed
  projects: Project[];
  proposals: Proposal[];
  notifications: NotificationItem[];
  unreadNotifsCount: number;
  pushEnabled: boolean;
  soundEnabled: boolean;
  connectWallet: (wallet: string) => void;
  disconnectWallet: () => void;
  switchNetwork: (net: NetworkType) => void;
  requestFaucet: () => void;
  stakeFad: (amount: number) => { success: boolean; message: string };
  stakeBrew: (amount: number) => { success: boolean; message: string }; // alias
  unstakeFad: (amount: number) => { success: boolean; message: string };
  unstakeBrew: (amount: number) => { success: boolean; message: string }; // alias
  harvestYield: () => void;
  contributeToProject: (projectId: string, amountBnb: number) => { success: boolean; message: string };
  claimVestingTokens: (projectId: string) => { success: boolean; tokensClaimed: number; txHash: string };
  voteMilestone: (projectId: string, milestoneId: string, vote: 'yes' | 'no') => void;
  voteProposal: (proposalId: string, choice: 'for' | 'against' | 'abstain') => void;
  createProposal: (title: string, description: string, category: any) => void;
  deployLaunchpadProject: (newProject: Partial<Project>) => string;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  togglePushNotifications: () => void;
  toggleSound: () => void;
  playFadChime: () => void;
  playBrewChime: () => void;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

// Web Audio synthesizer for crisp Web3 actions
function playSynthesizedSound(type: 'chime' | 'success' | 'alert') {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (type === 'chime') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'success') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc.start(now);
      osc.stop(now + 0.45);
    } else {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.2);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    }
  } catch (e) {
    // Ignore audio failures if browser blocks autoplay
  }
}

export const Web3Provider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [address, setAddress] = useState<string>('0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D');
  const [walletName, setWalletName] = useState<string>('Binance Web3 Wallet');
  const [network, setNetwork] = useState<NetworkType>('bsc-mainnet');

  const [bnbBalance, setBnbBalance] = useState<number>(18.45);
  const [fadBalance, setFadBalance] = useState<number>(8500);
  const [stakedFad, setStakedFad] = useState<number>(10000); // starts in Gold Tier
  const [stakedTimestamp, setStakedTimestamp] = useState<number>(Date.now() - 86400000 * 18);
  const [pendingYieldFad, setPendingYieldFad] = useState<number>(142.85);

  const [userContributions, setUserContributions] = useState<Record<string, number>>({
    'fad-vault': 2.5,
    'cyber-malt': 1.0,
    'hop-swap': 3.5
  });

  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [proposals, setProposals] = useState<Proposal[]>(INITIAL_PROPOSALS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [pushEnabled, setPushEnabled] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Compute User Tier
  const calculateTier = (amount: number): TierLevel => {
    if (amount >= 50000) return 'Diamond';
    if (amount >= 25000) return 'Platinum';
    if (amount >= 10000) return 'Gold';
    if (amount >= 2500) return 'Silver';
    if (amount >= 500) return 'Copper';
    return 'None';
  };

  const userTier = calculateTier(stakedFad);
  const currentTierInfo = STAKING_TIERS.find((t) => t.id === userTier) || null;

  const nextTierInfo = (() => {
    if (userTier === 'Diamond') return null;
    if (userTier === 'Platinum') return STAKING_TIERS.find((t) => t.id === 'Diamond') || null;
    if (userTier === 'Gold') return STAKING_TIERS.find((t) => t.id === 'Platinum') || null;
    if (userTier === 'Silver') return STAKING_TIERS.find((t) => t.id === 'Gold') || null;
    if (userTier === 'Copper') return STAKING_TIERS.find((t) => t.id === 'Silver') || null;
    return STAKING_TIERS.find((t) => t.id === 'Copper') || null;
  })();

  // Increment yield continuously
  useEffect(() => {
    if (stakedFad <= 0) return;
    const apy = currentTierInfo ? currentTierInfo.baseApy : 10;
    const yieldPerSec = (stakedFad * (apy / 100)) / (365 * 86400);

    const interval = setInterval(() => {
      setPendingYieldFad((prev) => prev + yieldPerSec * 2);
    }, 2000);

    return () => clearInterval(interval);
  }, [stakedFad, currentTierInfo]);

  const playFadChime = () => {
    if (soundEnabled) playSynthesizedSound('chime');
  };

  const addNotification = (title: string, message: string, category: NotificationItem['category'], actionUrl?: string) => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title,
      message,
      category,
      timestamp: 'Just now',
      read: false,
      actionUrl
    };
    setNotifications((prev) => [newNotif, ...prev]);

    if (soundEnabled) {
      playSynthesizedSound('alert');
    }

    if (pushEnabled && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body: message,
          icon: '/favicon.ico'
        });
      } catch (e) {
        // Fallback for sandboxed environments
      }
    }
  };

  const connectWallet = (wallet: string) => {
    setIsConnected(true);
    setWalletName(wallet);
    playFadChime();
    addNotification('Wallet Connected', `Connected to ${wallet} on BSC Mainnet.`, 'system');
  };

  const disconnectWallet = () => {
    setIsConnected(false);
  };

  const switchNetwork = (net: NetworkType) => {
    setNetwork(net);
    playFadChime();
    addNotification(
      'Network Switched',
      `Active chain changed to ${net === 'bsc-mainnet' ? 'BNB Smart Chain (Chain ID: 56)' : 'BNB Testnet (Chain ID: 97)'}.`,
      'system'
    );
  };

  const requestFaucet = () => {
    setBnbBalance((prev) => +(prev + 5.0).toFixed(4));
    setFadBalance((prev) => prev + 10000);
    if (soundEnabled) playSynthesizedSound('success');
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } catch (e) {}
    addNotification('BSC Testnet Faucet Dispatched', 'Received +5.0000 BNB and +10,000 $FAD test tokens.', 'system');
  };

  const stakeFad = (amount: number) => {
    if (amount <= 0) return { success: false, message: 'Amount must be greater than 0' };
    if (amount > fadBalance) return { success: false, message: 'Insufficient $FAD balance' };

    setFadBalance((prev) => prev - amount);
    setStakedFad((prev) => prev + amount);
    setStakedTimestamp(Date.now());
    if (soundEnabled) playSynthesizedSound('success');
    addNotification('Staking Locked', `Successfully staked ${amount.toLocaleString()} $FAD into the FAD Staking Vault.`, 'ido', '#staking');
    return { success: true, message: `Successfully staked ${amount} $FAD` };
  };

  const unstakeFad = (amount: number) => {
    if (amount <= 0) return { success: false, message: 'Amount must be greater than 0' };
    if (amount > stakedFad) return { success: false, message: 'Amount exceeds staked balance' };

    setStakedFad((prev) => prev - amount);
    setFadBalance((prev) => prev + amount);
    if (soundEnabled) playSynthesizedSound('chime');
    addNotification('Unstaked $FAD', `Withdrew ${amount.toLocaleString()} $FAD to your active wallet.`, 'ido', '#staking');
    return { success: true, message: `Successfully unstaked ${amount} $FAD` };
  };

  const harvestYield = () => {
    if (pendingYieldFad <= 0) return;
    const harvested = pendingYieldFad;
    setFadBalance((prev) => +(prev + harvested).toFixed(2));
    setPendingYieldFad(0);
    if (soundEnabled) playSynthesizedSound('success');
    addNotification('FAD Yield Harvested', `Claimed ${harvested.toFixed(2)} $FAD staking yield.`, 'vesting', '#staking');
  };

  const contributeToProject = (projectId: string, amountBnb: number) => {
    if (!isConnected) return { success: false, message: 'Please connect your Web3 wallet first' };
    if (amountBnb <= 0) return { success: false, message: 'Amount must be greater than 0 BNB' };
    if (amountBnb > bnbBalance) return { success: false, message: 'Insufficient BNB balance in wallet' };

    const project = projects.find((p) => p.id === projectId);
    if (!project) return { success: false, message: 'Project not found' };

    const currentContributed = userContributions[projectId] || 0;
    if (currentContributed + amountBnb > project.maxBuyBnb) {
      return {
        success: false,
        message: `Exceeds max allocation cap of ${project.maxBuyBnb} BNB per wallet (You have already pledged ${currentContributed} BNB)`
      };
    }

    setBnbBalance((prev) => +(prev - amountBnb).toFixed(4));
    setUserContributions((prev) => ({
      ...prev,
      [projectId]: +(currentContributed + amountBnb).toFixed(4)
    }));

    // Update project state
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          return {
            ...p,
            raisedBnb: +(p.raisedBnb + amountBnb).toFixed(2),
            participantsCount: currentContributed === 0 ? p.participantsCount + 1 : p.participantsCount
          };
        }
        return p;
      })
    );

    if (soundEnabled) playSynthesizedSound('success');
    try {
      confetti({ particleCount: 65, spread: 75, origin: { y: 0.6 } });
    } catch (e) {}

    addNotification(
      'Fair Launch Allocation Confirmed',
      `Contributed ${amountBnb} BNB to ${project.name} (${project.symbol}). View details in Vesting dashboard.`,
      'ido',
      '#vesting'
    );

    return {
      success: true,
      message: `Successfully contributed ${amountBnb} BNB to ${project.name}`
    };
  };

  const claimVestingTokens = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return { success: false, tokensClaimed: 0, txHash: '' };

    const userPledgedBnb = userContributions[projectId] || 0;
    if (userPledgedBnb <= 0) return { success: false, tokensClaimed: 0, txHash: '' };

    let tokenShare = 0;
    if (project.launchType === 'overflow' && project.raisedBnb > project.hardCapBnb) {
      const userRatio = userPledgedBnb / project.raisedBnb;
      tokenShare = userRatio * project.totalTokensSale;
    } else {
      tokenShare = (userPledgedBnb / project.hardCapBnb) * project.totalTokensSale;
    }

    const availableClaim = +(tokenShare * 0.25).toFixed(2);
    const fakeTx = `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

    if (soundEnabled) playSynthesizedSound('success');
    try {
      confetti({ particleCount: 80, spread: 90, origin: { y: 0.55 } });
    } catch (e) {}

    addNotification(
      'Vesting Stream Claim Executed',
      `Successfully claimed ${availableClaim.toLocaleString()} ${project.symbol} to your BSC wallet (TX: ${fakeTx.slice(0, 10)}...).`,
      'vesting',
      '#vesting'
    );

    return {
      success: true,
      tokensClaimed: availableClaim,
      txHash: fakeTx
    };
  };

  const voteMilestone = (projectId: string, milestoneId: string, vote: 'yes' | 'no') => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== projectId) return proj;
        return {
          ...proj,
          milestones: proj.milestones.map((m) => {
            if (m.id !== milestoneId) return m;
            return {
              ...m,
              userVoted: vote,
              approvalVotesYes: vote === 'yes' ? m.approvalVotesYes + 1 : m.approvalVotesYes,
              approvalVotesNo: vote === 'no' ? m.approvalVotesNo + 1 : m.approvalVotesNo
            };
          })
        };
      })
    );

    if (soundEnabled) playSynthesizedSound('chime');
    addNotification('Milestone Ballot Cast', `Your vote has been recorded on BSC for ${milestoneId.toUpperCase()}.`, 'governance');
  };

  const voteProposal = (proposalId: string, choice: 'for' | 'against' | 'abstain') => {
    setProposals((prev) =>
      prev.map((p) => {
        if (p.id !== proposalId) return p;
        return {
          ...p,
          hasUserVoted: choice,
          votesFor: choice === 'for' ? p.votesFor + (stakedFad || 100) : p.votesFor,
          votesAgainst: choice === 'against' ? p.votesAgainst + (stakedFad || 100) : p.votesAgainst,
          votesAbstain: choice === 'abstain' ? p.votesAbstain + (stakedFad || 100) : p.votesAbstain
        };
      })
    );
    if (soundEnabled) playSynthesizedSound('success');
    addNotification('Governance Vote Recorded', `Voted ${choice.toUpperCase()} on proposal ${proposalId.toUpperCase()}.`, 'governance');
  };

  const createProposal = (title: string, description: string, category: any) => {
    const newProp: Proposal = {
      id: `fip-${proposals.length + 14}`,
      number: proposals.length + 14,
      title,
      description,
      proposer: `${address.slice(0, 6)}...${address.slice(-4)}`,
      category,
      status: 'active',
      votesFor: stakedFad || 500,
      votesAgainst: 0,
      votesAbstain: 0,
      quorumPct: 12.4,
      minQuorumPct: 60,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
      executionDelayHours: 24,
      hasUserVoted: 'for'
    };
    setProposals((prev) => [newProp, ...prev]);
    if (soundEnabled) playSynthesizedSound('success');
    addNotification('Proposal Published', `Created new governance proposal FIP-${newProp.number}.`, 'governance');
  };

  const deployLaunchpadProject = (newProjectData: Partial<Project>) => {
    const newId = `project-${Date.now()}`;
    const generatedContract = `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

    const fullProject: Project = {
      id: newId,
      name: newProjectData.name || 'New FAD Project',
      symbol: newProjectData.symbol || 'NFAD',
      tagline: newProjectData.tagline || 'Next-Gen DeFi Protocol on Binance Smart Chain',
      description: newProjectData.description || 'Deployed using FAD EIP-1167 Minimal Proxy Factory with upgradeable proxy support.',
      logo: '/logo.png',
      banner: '/images/brew_launchpad_hero_1790661362294.jpg',
      launchType: newProjectData.launchType || 'fair-launch',
      status: 'upcoming',
      tokenPriceBnb: newProjectData.tokenPriceBnb || 0.001,
      tokenPriceUsd: (newProjectData.tokenPriceBnb || 0.001) * 600,
      softCapBnb: newProjectData.softCapBnb || 100,
      hardCapBnb: newProjectData.hardCapBnb || 300,
      raisedBnb: 0,
      totalTokensSale: newProjectData.totalTokensSale || 300000,
      minBuyBnb: newProjectData.minBuyBnb || 0.05,
      maxBuyBnb: newProjectData.maxBuyBnb || 2.0,
      participantsCount: 0,
      startTime: new Date(Date.now() + 86400000 * 2).toISOString(),
      endTime: new Date(Date.now() + 86400000 * 5).toISOString(),
      dexPair: `${newProjectData.symbol || 'NFAD'} / WBNB`,
      liquidityLockPct: newProjectData.liquidityLockPct || 70,
      liquidityLockMonths: newProjectData.liquidityLockMonths || 12,
      contractAddress: generatedContract,
      website: 'https://fad.family',
      twitter: 'https://twitter.com/FADProtocol',
      telegram: 'https://t.me/FADCommunity',
      github: 'https://github.com/fad-protocol',
      antiSniperBotActive: true,
      maxTxPerBlock: 2,
      category: newProjectData.category || 'DeFi',
      audit: {
        auditor: 'FAD Security',
        date: 'Pre-Audit Verified',
        score: 95,
        reportUrl: '#',
        criticalIssues: 0,
        mediumIssues: 0,
        lowIssues: 1,
        reentrancyProtected: true,
        honeypotImmune: true,
        liquidityLockedDays: 365,
        mintDisabled: true,
        maxTaxFeePct: 0,
        ownershipStatus: 'Multi-Sig Timelock',
        proxyStandard: 'ERC-1967 UUPS',
        contractAddress: generatedContract,
        verifiedOnBscScan: true
      },
      milestones: [
        {
          id: `ms-${Date.now()}-1`,
          title: 'Milestone 1: PancakeSwap v3 Liquidity Pool Creation',
          description: 'Provide 70% raised funds to DEX liquidity and lock LP tokens with PinkLock.',
          percentageRelease: 50,
          amountBnb: +( (newProjectData.hardCapBnb || 300) * 0.5 ).toFixed(1),
          dueDate: '30 Days Post-TGE',
          status: 'pending',
          approvalVotesYes: 0,
          approvalVotesNo: 0
        },
        {
          id: `ms-${Date.now()}-2`,
          title: 'Milestone 2: Security Audit & Product Mainnet Beta',
          description: 'Pass secondary CertiK audit and open beta staking vault.',
          percentageRelease: 50,
          amountBnb: +( (newProjectData.hardCapBnb || 300) * 0.5 ).toFixed(1),
          dueDate: '60 Days Post-TGE',
          status: 'pending',
          approvalVotesYes: 0,
          approvalVotesNo: 0
        }
      ],
      vesting: {
        tgeUnlockPct: newProjectData.vesting?.tgeUnlockPct || 25,
        cliffDurationDays: newProjectData.vesting?.cliffDurationDays || 14,
        vestingDurationDays: newProjectData.vesting?.vestingDurationDays || 90,
        claimInterval: 'stream',
        totalTokensAllocated: newProjectData.totalTokensSale || 300000,
        tokensClaimed: 0,
        startTime: Date.now() + 86400000 * 2
      }
    };

    setProjects((prev) => [fullProject, ...prev]);
    if (soundEnabled) playSynthesizedSound('success');
    try {
      confetti({ particleCount: 70, spread: 80 });
    } catch (e) {}

    addNotification(
      'Launchpad Pool Deployed via EIP-1167 Clone',
      `Spawned clone proxy at ${generatedContract.slice(0, 10)}... Gas saved: 2,705,000 gas (~95%).`,
      'ido',
      '#launchpad'
    );

    return generatedContract;
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const togglePushNotifications = () => {
    if (!pushEnabled && 'Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          setPushEnabled(true);
          addNotification('Push Alerts Activated', 'Real-time protocol push notifications are now active.', 'system');
        }
      });
    } else {
      setPushEnabled((prev) => !prev);
    }
  };

  const toggleSound = () => {
    setSoundEnabled((prev) => !prev);
  };

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  return (
    <Web3Context.Provider
      value={{
        isConnected,
        address,
        walletName,
        network,
        bnbBalance,
        fadBalance,
        brewBalance: fadBalance, // backward-compat alias
        stakedFad,
        stakedBrew: stakedFad, // backward-compat alias
        userTier,
        currentTierInfo,
        nextTierInfo,
        pendingYieldFad,
        pendingYieldBrew: pendingYieldFad, // backward-compat alias
        stakedTimestamp,
        userContributions,
        projects,
        proposals,
        notifications,
        unreadNotifsCount,
        pushEnabled,
        soundEnabled,
        connectWallet,
        disconnectWallet,
        switchNetwork,
        requestFaucet,
        stakeFad,
        stakeBrew: stakeFad, // alias
        unstakeFad,
        unstakeBrew: unstakeFad, // alias
        harvestYield,
        contributeToProject,
        claimVestingTokens,
        voteMilestone,
        voteProposal,
        createProposal,
        deployLaunchpadProject,
        markNotificationAsRead,
        clearAllNotifications,
        togglePushNotifications,
        toggleSound,
        playFadChime,
        playBrewChime: playFadChime
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) throw new Error('useWeb3 must be used within a Web3Provider');
  return context;
};
