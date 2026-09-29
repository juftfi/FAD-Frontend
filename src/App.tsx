import React, { useState } from 'react';
import { Web3Provider, useWeb3 } from './context/Web3Context';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';
import { Footer } from './components/layout/Footer';
import { WalletModal } from './components/common/WalletModal';
import { NotificationCenter } from './components/common/NotificationCenter';
import { LaunchpadView } from './components/launchpad/LaunchpadView';
import { TieredStakingView } from './components/staking/TieredStakingView';
import { FairLaunchSimulator } from './components/fairlaunch/FairLaunchSimulator';
import { VestingPortal } from './components/vesting/VestingPortal';
import { MilestoneDashboard } from './components/milestones/MilestoneDashboard';
import { AuditSecurityView } from './components/audit/AuditSecurityView';
import { UpgradeableContractsView } from './components/contracts/UpgradeableContractsView';
import { GasOptimizedDeployer } from './components/factory/GasOptimizedDeployer';
import { GovernancePortal } from './components/governance/GovernancePortal';
import { DeveloperDocs } from './components/docs/DeveloperDocs';

function MainApp() {
  const [activeTab, setActiveTab] = useState<string>('launchpad');
  const [isWalletModalOpen, setIsWalletModalOpen] = useState<boolean>(false);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#080C14] text-[#F3F4F6]">
      {/* Strict Top Bar Contract Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openNotificationCenter={() => setIsNotificationCenterOpen(true)}
        openWalletModal={() => setIsWalletModalOpen(true)}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'launchpad' && <LaunchpadView setActiveTab={setActiveTab} />}
        {activeTab === 'staking' && <TieredStakingView />}
        {activeTab === 'fairlaunch' && <FairLaunchSimulator />}
        {activeTab === 'vesting' && <VestingPortal />}
        {activeTab === 'milestones' && <MilestoneDashboard />}
        {activeTab === 'audit' && <AuditSecurityView />}
        {activeTab === 'contracts' && <UpgradeableContractsView />}
        {activeTab === 'factory' && <GasOptimizedDeployer setActiveTab={setActiveTab} />}
        {activeTab === 'governance' && <GovernancePortal />}
        {activeTab === 'docs' && <DeveloperDocs />}
      </main>

      {/* Mobile Responsive Navigation Bar */}
      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />

      {/* Web3 Wallet Modal */}
      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
      />

      {/* Real-Time Push Notification Center */}
      <NotificationCenter
        isOpen={isNotificationCenterOpen}
        onClose={() => setIsNotificationCenterOpen(false)}
        setActiveTab={setActiveTab}
      />
    </div>
  );
}

export default function App() {
  return (
    <Web3Provider>
      <MainApp />
    </Web3Provider>
  );
}
