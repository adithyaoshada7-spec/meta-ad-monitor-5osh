import { useState } from 'react';
import { useMetaAds } from './hooks/useMetaAds';
import { Navbar } from './components/Navbar';
import { SummaryCards } from './components/SummaryCards';
import { BudgetOverview } from './components/BudgetOverview';
import { CampaignTable } from './components/CampaignTable';
import { ChartsSection } from './components/ChartsSection';
import { SettingsModal } from './components/SettingsModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AlertCircle, Zap, ShieldCheck } from 'lucide-react';

export function App() {
  const {
    campaigns,
    allCampaigns,
    summary,
    loading,
    error,
    lastUpdated,
    settings,
    statusFilter,
    objectiveFilter,
    searchQuery,
    setStatusFilter,
    setObjectiveFilter,
    setSearchQuery,
    updateSettings,
    refreshData
  } = useMetaAds();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
        
        {/* Navigation Top Bar */}
        <Navbar
          settings={settings}
          loading={loading}
          lastUpdated={lastUpdated}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onRefresh={refreshData}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onUpdateSettings={updateSettings}
        />

        {/* Main Dashboard Body */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6">
          
          {/* Demo Mode / Missing Token Notification Banner */}
          {(!settings.isLiveMode || !settings.accessToken) && !error && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-amber-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <strong className="font-bold text-amber-100">Showing Simulated Demo Data:</strong> Ad Account <code className="text-amber-300 font-mono">act_1397457568798633</code> requires a Meta Access Token to fetch live Facebook Graph API data.
                </div>
              </div>
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="px-3.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-100 border border-amber-500/40 rounded-xl font-semibold shrink-0 transition-all flex items-center gap-1.5 shadow-sm"
              >
                <span>Connect Live Token</span>
              </button>
            </div>
          )}

          {/* API Error Notification (If any) */}
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-4 text-rose-300 text-xs flex items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                <div>
                  <strong className="font-bold text-rose-200">Meta API Error:</strong> {error}
                </div>
              </div>
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/30 rounded-lg font-semibold shrink-0"
              >
                Configure Keys
              </button>
            </div>
          )}

          {/* Subheader Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800/80 p-4 lg:p-5 rounded-2xl">
            <div>
              <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                Meta Ads Real-Time Intelligence
                <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-full">
                  v2.0 Crash Guard Active
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Displaying {statusFilter === 'ACTIVE' ? 'Active Campaigns only' : 'All Campaigns'} normalized safely across all Meta Objectives (Leads, Sales, Messages, Clicks, Reach).
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20">
                <ShieldCheck className="w-4 h-4" />
                Zero Data Crash Protection
              </span>
              <span className="flex items-center gap-1.5 text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-xl border border-indigo-500/20">
                <Zap className="w-4 h-4" />
                Live Polling Engine
              </span>
            </div>
          </div>

          {/* Top Metric Summary Cards */}
          <SummaryCards summary={summary} activeFilter={statusFilter} currency={settings.currency} />

          {/* Active Campaign Budget Monitor */}
          <BudgetOverview campaigns={allCampaigns} currency={settings.currency} />

          {/* Recharts Analytics Section */}
          <ChartsSection summary={summary} currency={settings.currency} />

          {/* Detailed Campaign Table with Objective Badge & Dynamic Metrics */}
          <CampaignTable
            campaigns={campaigns}
            searchQuery={searchQuery}
            objectiveFilter={objectiveFilter}
            currency={settings.currency}
            onSearchChange={setSearchQuery}
            onObjectiveFilterChange={setObjectiveFilter}
          />

        </main>

        {/* Footer */}
        <footer className="border-t border-slate-900 py-4 px-4 text-center text-xs text-slate-500">
          Meta Ads Realtime Dashboard &copy; 2026 — Built for High Performance & Objective-driven Dynamic Data Handling.
        </footer>

        {/* Settings Modal */}
        <SettingsModal
          isOpen={isSettingsOpen}
          settings={settings}
          onClose={() => setIsSettingsOpen(false)}
          onSave={updateSettings}
        />

      </div>
    </ErrorBoundary>
  );
}

export default App;
