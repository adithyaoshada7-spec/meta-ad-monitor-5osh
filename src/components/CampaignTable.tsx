import React from 'react';
import { 
  Search, 
  Layers, 
  MessageSquare, 
  ShoppingCart, 
  Users, 
  MousePointer, 
  Eye, 
  Smartphone, 
  HelpCircle,
  TrendingUp,
  DollarSign,
  Flag
} from 'lucide-react';
import type { NormalizedCampaign, ObjectiveCategory } from '../types/meta';
import { formatCurrency as fmtCurrency } from '../utils/currencyFormatter';

interface CampaignTableProps {
  campaigns: NormalizedCampaign[];
  searchQuery: string;
  objectiveFilter: string;
  pageFilter: string;
  availablePages: string[];
  currency?: string;
  onSearchChange: (q: string) => void;
  onObjectiveFilterChange: (obj: string) => void;
  onPageFilterChange: (page: string) => void;
}

export const CampaignTable: React.FC<CampaignTableProps> = ({
  campaigns,
  searchQuery,
  objectiveFilter,
  pageFilter,
  availablePages,
  currency = 'LKR',
  onSearchChange,
  onObjectiveFilterChange,
  onPageFilterChange
}) => {

  const formatCurrency = (val: number) => fmtCurrency(val, currency);

  const formatNumber = (val: number) => {
    if (val === undefined || val === null || isNaN(val)) return '0';
    return new Intl.NumberFormat('en-US').format(Math.round(val));
  };

  // Helper badge for campaign objective category
  const getObjectiveBadge = (cat: ObjectiveCategory, rawObjective: string) => {
    switch (cat) {
      case 'LEADS':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
            <Users className="w-3.5 h-3.5" />
            Leads
          </span>
        );
      case 'SALES':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            <ShoppingCart className="w-3.5 h-3.5" />
            Sales
          </span>
        );
      case 'MESSAGES':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-sky-500/15 text-sky-300 border border-sky-500/30">
            <MessageSquare className="w-3.5 h-3.5" />
            Messages
          </span>
        );
      case 'TRAFFIC':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <MousePointer className="w-3.5 h-3.5" />
            Traffic
          </span>
        );
      case 'AWARENESS':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-500/15 text-blue-300 border border-blue-500/30">
            <Eye className="w-3.5 h-3.5" />
            Awareness
          </span>
        );
      case 'ENGAGEMENT':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/20">
            <TrendingUp className="w-3.5 h-3.5" />
            Engagement
          </span>
        );
      case 'APP_PROMOTION':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">
            <Smartphone className="w-3.5 h-3.5" />
            App Promo
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-700 text-slate-300 border border-slate-600">
            <HelpCircle className="w-3.5 h-3.5" />
            {rawObjective || 'Other'}
          </span>
        );
    }
  };

  const objectivesList = [
    { key: 'ALL', label: 'All Objectives' },
    { key: 'LEADS', label: 'Leads' },
    { key: 'SALES', label: 'Sales / Conversions' },
    { key: 'MESSAGES', label: 'Messages' },
    { key: 'TRAFFIC', label: 'Traffic / Clicks' },
    { key: 'AWARENESS', label: 'Awareness & Reach' },
    { key: 'ENGAGEMENT', label: 'Engagement' },
    { key: 'APP_PROMOTION', label: 'App Installs' }
  ];

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl backdrop-blur-md overflow-hidden">
      
      {/* Controls Bar: Search & Facebook Page Filter & Objective Filters */}
      <div className="p-4 lg:p-5 border-b border-slate-800 flex flex-col gap-3.5">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search campaign or FB page..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-700/70 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>

          {/* Facebook Page Filter Dropdown */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs font-semibold text-slate-400 whitespace-nowrap flex items-center gap-1.5">
              <Flag className="w-3.5 h-3.5 text-indigo-400" />
              Filter by FB Page:
            </span>
            <select
              value={pageFilter}
              onChange={(e) => onPageFilterChange(e.target.value)}
              className="bg-slate-950/90 border border-slate-700/80 rounded-xl px-3 py-2 text-xs font-semibold text-indigo-200 focus:outline-none focus:border-indigo-500 cursor-pointer w-full md:w-auto"
            >
              <option value="ALL" className="bg-slate-900 text-slate-200">🚩 All Facebook Pages ({availablePages.length})</option>
              {availablePages.map(page => (
                <option key={page} value={page} className="bg-slate-900 text-slate-200">
                  {page}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Objective Pill Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 no-scrollbar">
          {objectivesList.map(obj => (
            <button
              key={obj.key}
              onClick={() => onObjectiveFilterChange(obj.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                objectiveFilter === obj.key
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/50'
              }`}
            >
              {obj.label}
            </button>
          ))}
        </div>

      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950/70 border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 font-bold">
              <th className="py-3.5 px-4 lg:px-6">Campaign Name</th>
              <th className="py-3.5 px-3">Facebook Page</th>
              <th className="py-3.5 px-3">Status</th>
              <th className="py-3.5 px-3">Objective</th>
              <th className="py-3.5 px-4 text-right">Budget</th>
              <th className="py-3.5 px-4 text-right">Amount Spent</th>
              <th className="py-3.5 px-4 text-right">Primary Result</th>
              <th className="py-3.5 px-4 text-right">Cost per Result (CPR)</th>
              <th className="py-3.5 px-3 text-right">CTR</th>
              <th className="py-3.5 px-3 text-right">CPC</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {campaigns.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Layers className="w-8 h-8 text-slate-600" />
                    <p className="font-semibold text-slate-400">No campaigns found matching filter criteria.</p>
                    <p className="text-xs text-slate-500">Try changing your search term, Facebook Page filter, or objective filter.</p>
                  </div>
                </td>
              </tr>
            ) : (
              campaigns.map((cmp) => {
                const isAct = cmp.status === 'ACTIVE';
                const res = cmp.primaryResult;
                const budgetVal = cmp.dailyBudget || cmp.lifetimeBudget || 0;

                return (
                  <tr 
                    key={cmp.id}
                    className="hover:bg-slate-800/40 transition-colors group"
                  >
                    {/* Campaign Name */}
                    <td className="py-3.5 px-4 lg:px-6 max-w-[240px]">
                      <div className="font-bold text-slate-100 group-hover:text-indigo-300 transition-colors line-clamp-1" title={cmp.name}>
                        {cmp.name}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        ID: {cmp.id}
                      </div>
                    </td>

                    {/* Facebook Page Badge */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800/90 text-indigo-300 border border-slate-700/80">
                        <Flag className="w-3 h-3 text-indigo-400 shrink-0" />
                        {cmp.pageName || 'Main Page'}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      {isAct ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                          ACTIVE
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                          {cmp.status}
                        </span>
                      )}
                    </td>

                    {/* Objective Badge */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      {getObjectiveBadge(cmp.objectiveCategory, cmp.objective)}
                    </td>

                    {/* Budget */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap font-medium text-slate-300">
                      <div>{formatCurrency(budgetVal)}</div>
                      <div className="text-[10px] text-slate-500 uppercase">{cmp.budgetType}</div>
                    </td>

                    {/* Amount Spent */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap font-bold text-white">
                      <div>{formatCurrency(cmp.amountSpent)}</div>
                      <div className="w-16 ml-auto bg-slate-800 rounded-full h-1 mt-1 overflow-hidden">
                        <div
                          className="bg-indigo-500 h-full rounded-full"
                          style={{ width: `${Math.min(100, cmp.spentPercentage)}%` }}
                        ></div>
                      </div>
                    </td>

                    {/* Dynamic Primary Result */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="font-extrabold text-indigo-300 text-sm">
                        {formatNumber(res.count)} <span className="text-xs font-normal text-slate-400">{res.unitLabel}s</span>
                      </div>
                      {res.value && res.value > 0 ? (
                        <div className="text-[10px] text-emerald-400 font-semibold flex items-center justify-end gap-1 mt-0.5">
                          <DollarSign className="w-3 h-3 inline" />
                          {formatCurrency(res.value)} ({res.roas?.toFixed(2)}x ROAS)
                        </div>
                      ) : (
                        <div className="text-[10px] text-slate-500">{res.name}</div>
                      )}
                    </td>

                    {/* Cost Per Result (CPR) */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="font-bold text-amber-300">
                        {formatCurrency(res.costPerResult)}
                      </div>
                      <div className="text-[10px] text-slate-500">per {res.unitLabel}</div>
                    </td>

                    {/* CTR */}
                    <td className="py-3.5 px-3 text-right whitespace-nowrap font-medium text-slate-300">
                      {cmp.ctr.toFixed(2)}%
                    </td>

                    {/* CPC */}
                    <td className="py-3.5 px-3 text-right whitespace-nowrap font-medium text-slate-300">
                      {formatCurrency(cmp.cpc)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
