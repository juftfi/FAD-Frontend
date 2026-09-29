import React from 'react';
import { Rocket, Trophy, Waves, Clock, ShieldCheck, Vote, FileCode } from 'lucide-react';

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'launchpad', label: 'Pools', icon: Rocket },
    { id: 'staking', label: 'Staking', icon: Trophy },
    { id: 'fairlaunch', label: 'Fair Launch', icon: Waves },
    { id: 'vesting', label: 'Vesting', icon: Clock },
    { id: 'audit', label: 'Security', icon: ShieldCheck },
    { id: 'governance', label: 'Gov', icon: Vote }
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#080C14]/95 border-t border-[#1E293B] backdrop-blur-lg px-2 py-1">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center min-w-[50px] min-h-[48px] py-1 px-1 rounded-lg transition-colors ${
                isActive
                  ? 'text-amber-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-amber-400 scale-110' : 'text-slate-400'}`} />
              <span className="text-[10px] tracking-tight whitespace-nowrap">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
