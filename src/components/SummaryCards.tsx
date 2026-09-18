import React from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Award, 
  Layers, 
  CheckCircle2 
} from 'lucide-react';
import type { DashboardSummary } from '../types/meta';
import { formatCurrency } from '../utils/currencyFormatter';

interface SummaryCardsProps {
  summary: DashboardSummary;
  activeFilter: string;
  currency?: string;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ summary, activeFilter, currency = 'LKR' }) => {

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(Math.round(num));
  };

  const budgetUsedPct = summary.totalBudget > 0 
    ? Math.min(100, (summary.totalSpent / summary.totalBudget) * 100).toFixed(1)
    : '0';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* Total Spend Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg backdrop-blur-md relative overflow-hidden group hover:border-slate-700/80 transition-all">
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Ad Spend</span>
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
        <div className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
          {formatCurrency(summary.totalSpent, currency)}
        </div>
        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="text-slate-400">Total Budget: <strong className="text-slate-200">{formatCurrency(summary.totalBudget, currency)}</strong></span>
          <span className="font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
            {budgetUsedPct}% Used
          </span>
        </div>
        {/* Progress line */}
        <div className="mt-2.5 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, Number(budgetUsedPct))}%` }}
          ></div>
        </div>
      </div>

      {/* Active Campaigns Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg backdrop-blur-md relative overflow-hidden group hover:border-slate-700/80 transition-all">
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all"></div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Campaign Status</span>
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Layers className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
            {summary.activeCampaignsCount}
          </span>
          <span className="text-slate-400 text-sm font-medium">Active</span>
          <span className="text-slate-500 text-xs">/ {summary.totalCampaigns} Total</span>
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{activeFilter === 'ACTIVE' ? 'Filtered: Active Campaigns Only' : 'Showing All Campaigns'}</span>
        </div>
      </div>

      {/* Primary Results Count */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg backdrop-blur-md relative overflow-hidden group hover:border-slate-700/80 transition-all">
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all"></div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Combined Results</span>
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Award className="w-5 h-5" />
          </div>
        </div>
        <div className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
          {formatNumber(summary.totalResults)}
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
          <span>Leads: <strong className="text-purple-300">{summary.resultsByObjective.LEADS || 0}</strong></span>
          <span>Sales: <strong className="text-emerald-300">{summary.resultsByObjective.SALES || 0}</strong></span>
          <span>Msgs: <strong className="text-blue-300">{summary.resultsByObjective.MESSAGES || 0}</strong></span>
        </div>
      </div>

      {/* Engagement & CTR */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg backdrop-blur-md relative overflow-hidden group hover:border-slate-700/80 transition-all">
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">CTR & Impressions</span>
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
            {summary.avgCtr.toFixed(2)}%
          </span>
          <span className="text-xs text-slate-400 font-medium">Avg CTR</span>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
          <span>Impressions: <strong className="text-slate-200">{formatNumber(summary.totalImpressions)}</strong></span>
          <span>CPC: <strong className="text-slate-200">{formatCurrency(summary.avgCpc, currency)}</strong></span>
        </div>
      </div>

    </div>
  );
};
