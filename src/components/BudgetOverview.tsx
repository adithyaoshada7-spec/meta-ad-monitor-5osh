import React from 'react';
import { Wallet, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import type { NormalizedCampaign } from '../types/meta';
import { formatCurrency } from '../utils/currencyFormatter';

interface BudgetOverviewProps {
  campaigns: NormalizedCampaign[];
  currency?: string;
}

export const BudgetOverview: React.FC<BudgetOverviewProps> = ({ campaigns, currency = 'LKR' }) => {
  const activeCampaigns = campaigns.filter(c => c.status === 'ACTIVE');

  const formatCurr = (val: number) => formatCurrency(val, currency);

  const getBudgetStatusBadge = (pct: number) => {
    if (pct >= 90) {
      return (
        <span className="flex items-center gap-1 text-[11px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
          <AlertCircle className="w-3 h-3" />
          Near Cap ({pct.toFixed(0)}%)
        </span>
      );
    }
    if (pct >= 75) {
      return (
        <span className="flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
          <Clock className="w-3 h-3" />
          High Spend ({pct.toFixed(0)}%)
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
        <CheckCircle className="w-3 h-3" />
        Optimal ({pct.toFixed(0)}%)
      </span>
    );
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Active Campaign Budget Monitor</h3>
            <p className="text-xs text-slate-400">Real-time spend progress and allocation limits</p>
          </div>
        </div>
        <span className="text-xs font-semibold text-slate-300 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
          {activeCampaigns.length} Active Campaigns
        </span>
      </div>

      {activeCampaigns.length === 0 ? (
        <div className="py-8 text-center text-slate-500 text-sm">
          No active campaigns matching current filter settings.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {activeCampaigns.slice(0, 6).map(cmp => {
            const budgetVal = cmp.dailyBudget || cmp.lifetimeBudget || 0;
            const pct = cmp.spentPercentage;

            return (
              <div 
                key={cmp.id}
                className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 hover:border-slate-700/80 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="text-xs font-semibold text-slate-200 line-clamp-1" title={cmp.name}>
                      {cmp.name}
                    </h4>
                    {getBudgetStatusBadge(pct)}
                  </div>

                  <div className="flex items-baseline justify-between text-xs text-slate-400 mb-1.5">
                    <span>Type: <strong className="text-slate-300">{cmp.budgetType}</strong></span>
                    <span>Budget: <strong className="text-slate-200">{formatCurr(budgetVal)}</strong></span>
                  </div>

                  {/* Spend Progress Bar */}
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mb-2">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        pct >= 90 
                          ? 'bg-rose-500' 
                          : pct >= 75 
                            ? 'bg-amber-500' 
                            : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, pct)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/60 text-slate-400">
                  <span>Spent: <strong className="text-white">{formatCurr(cmp.amountSpent)}</strong></span>
                  <span>Rem: <strong className="text-teal-400">{formatCurr(cmp.remainingBudget)}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
