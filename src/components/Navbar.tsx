import React from 'react';
import { 
  Activity, 
  RefreshCw, 
  Settings, 
  Wifi, 
  Radio, 
  Filter
} from 'lucide-react';
import type { ApiSettings, CampaignStatus } from '../types/meta';

interface NavbarProps {
  settings: ApiSettings;
  loading: boolean;
  lastUpdated: Date;
  statusFilter: CampaignStatus;
  onStatusFilterChange: (status: CampaignStatus) => void;
  onRefresh: () => void;
  onOpenSettings: () => void;
  onUpdateSettings: (newSettings: Partial<ApiSettings>) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  loading,
  lastUpdated,
  statusFilter,
  onStatusFilterChange,
  onRefresh,
  onOpenSettings,
  onUpdateSettings
}) => {
  const formattedTime = lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5 shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & Live Status */}
        <div className="flex items-center gap-3.5 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight leading-none">
                Meta Ads <span className="text-indigo-400 font-extrabold">Realtime</span>
              </h1>
              <p className="text-xs text-slate-400 mt-1 font-medium">Objective Performance & Budget Monitor</p>
            </div>
          </div>

          {/* Connection Status Badge */}
          <div className="flex items-center gap-2 px-3 py-1.2 rounded-full text-xs font-semibold bg-slate-800/90 border border-slate-700/80">
            {settings.isLiveMode ? (
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <Wifi className="w-3.5 h-3.5" />
                Live Graph API
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-amber-400">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                Simulated Realtime Demo
              </span>
            )}
          </div>
        </div>

        {/* Controls & Refresh */}
        <div className="flex items-center flex-wrap gap-2.5 w-full md:w-auto justify-end">
          
          {/* Active Campaigns Quick Filter */}
          <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
            <button
              onClick={() => onStatusFilterChange('ACTIVE')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === 'ACTIVE' 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Active Only
            </button>
            <button
              onClick={() => onStatusFilterChange('ALL')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === 'ALL' 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Filter className="w-3 h-3" />
              All Statuses
            </button>
          </div>

          {/* Auto Refresh Interval Selector */}
          <div className="flex items-center bg-slate-800/80 px-2.5 py-1 rounded-xl border border-slate-700/60 text-xs">
            <span className="text-slate-400 mr-2 font-medium hidden sm:inline">Auto-sync:</span>
            <select
              value={settings.autoRefreshInterval}
              onChange={(e) => onUpdateSettings({ autoRefreshInterval: Number(e.target.value) })}
              className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer py-1"
            >
              <option value={10} className="bg-slate-900 text-slate-200">10s (Instant)</option>
              <option value={30} className="bg-slate-900 text-slate-200">30s</option>
              <option value={60} className="bg-slate-900 text-slate-200">1 min</option>
              <option value={300} className="bg-slate-900 text-slate-200">5 min</option>
              <option value={0} className="bg-slate-900 text-slate-200">Paused</option>
            </select>
          </div>

          {/* Manual Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700/80 rounded-xl text-xs font-semibold text-slate-200 transition-all hover:border-slate-600 shadow-sm active:scale-95"
            title={`Last updated: ${formattedTime}`}
          >
            <RefreshCw className={`w-3.5 h-3.5 text-indigo-400 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
            <span className="text-[10px] text-slate-400 font-mono">({formattedTime})</span>
          </button>

          {/* API Settings Modal Opener */}
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 hover:border-indigo-500/50 text-indigo-300 rounded-xl text-xs font-semibold transition-all shadow-sm"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>API Keys</span>
          </button>

        </div>
      </div>
    </header>
  );
};
