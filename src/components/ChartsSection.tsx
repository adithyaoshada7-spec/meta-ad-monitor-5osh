import React from 'react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { TrendingUp, BarChart3 } from 'lucide-react';
import type { DashboardSummary } from '../types/meta';

interface ChartsSectionProps {
  summary: DashboardSummary;
}

export const ChartsSection: React.FC<ChartsSectionProps> = ({ summary }) => {
  
  // Data for Objective Breakdown Bar Chart
  const objectiveData = [
    { name: 'Leads', count: summary.resultsByObjective.LEADS || 0, color: '#a855f7' },
    { name: 'Sales', count: summary.resultsByObjective.SALES || 0, color: '#10b981' },
    { name: 'Messages', count: summary.resultsByObjective.MESSAGES || 0, color: '#0284c7' },
    { name: 'Traffic', count: summary.resultsByObjective.TRAFFIC || 0, color: '#f59e0b' },
    { name: 'Awareness', count: summary.resultsByObjective.AWARENESS || 0, color: '#3b82f6' },
    { name: 'App Promo', count: summary.resultsByObjective.APP_PROMOTION || 0, color: '#f43f5e' }
  ];

  // Hourly Spend & Results Simulation Trend Data
  const hourlyTrendData = [
    { hour: '08:00', spend: summary.totalSpent * 0.05, results: Math.round(summary.totalResults * 0.04) },
    { hour: '10:00', spend: summary.totalSpent * 0.12, results: Math.round(summary.totalResults * 0.10) },
    { hour: '12:00', spend: summary.totalSpent * 0.25, results: Math.round(summary.totalResults * 0.22) },
    { hour: '14:00', spend: summary.totalSpent * 0.45, results: Math.round(summary.totalResults * 0.42) },
    { hour: '16:00', spend: summary.totalSpent * 0.68, results: Math.round(summary.totalResults * 0.65) },
    { hour: '18:00', spend: summary.totalSpent * 0.85, results: Math.round(summary.totalResults * 0.84) },
    { hour: 'Now', spend: summary.totalSpent, results: summary.totalResults }
  ];

  const formatCurrency = (val: number) => `$${val.toFixed(2)}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Realtime Hourly Spend & Conversion Trend */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Spend & Conversion Pace (Today)</h3>
              <p className="text-xs text-slate-400">Hourly accumulated ad spend vs objective results</p>
            </div>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hourlyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="resultsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="hour" stroke="#64748b" fontSize={11} />
              <YAxis yAxisId="left" stroke="#64748b" fontSize={11} tickFormatter={(v) => `$${v}`} />
              <YAxis yAxisId="right" orientation="right" stroke="#64748b" fontSize={11} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#f8fafc' }} 
                formatter={(value: any, name: any) => [name === 'spend' ? formatCurrency(value) : value, name === 'spend' ? 'Spend' : 'Results']}
              />
              <Area yAxisId="left" type="monotone" dataKey="spend" name="spend" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#spendGrad)" />
              <Area yAxisId="right" type="monotone" dataKey="results" name="results" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#resultsGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Results by Campaign Objective Bar Chart */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Results by Objective Type</h3>
              <p className="text-xs text-slate-400">Total generated conversion metrics by campaign goal</p>
            </div>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={objectiveData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#f8fafc' }} 
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {objectiveData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
