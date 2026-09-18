import { useState, useEffect, useCallback, useMemo } from 'react';
import type { 
  NormalizedCampaign, 
  DashboardSummary, 
  ApiSettings, 
  CampaignStatus, 
  ObjectiveCategory 
} from '../types/meta';
import { INITIAL_MOCK_CAMPAIGNS, jitterMockCampaigns } from '../utils/mockData';
import { fetchMetaCampaigns } from '../services/metaApi';

const envToken = (import.meta as any).env?.VITE_META_ACCESS_TOKEN || '';
const envAccountId = (import.meta as any).env?.VITE_META_AD_ACCOUNT_ID || 'act_1397457568798633';

const DEFAULT_SETTINGS: ApiSettings = {
  accessToken: envToken,
  adAccountId: envAccountId,
  apiVersion: 'v20.0',
  isLiveMode: Boolean(envToken),
  autoRefreshInterval: 10, // default 10 seconds auto-refresh
  currency: 'LKR',
  usdToLkrRate: 300
};

export function useMetaAds() {
  // Load settings from localStorage with env fallbacks
  const [settings, setSettings] = useState<ApiSettings>(() => {
    try {
      const saved = localStorage.getItem('meta_dashboard_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_SETTINGS,
          ...parsed,
          accessToken: parsed.accessToken || envToken,
          adAccountId: parsed.adAccountId || envAccountId,
          currency: parsed.currency || 'LKR',
          usdToLkrRate: parsed.usdToLkrRate || 300,
          isLiveMode: parsed.isLiveMode !== undefined ? parsed.isLiveMode : Boolean(envToken)
        };
      }
      return DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [campaigns, setCampaigns] = useState<NormalizedCampaign[]>(INITIAL_MOCK_CAMPAIGNS);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<CampaignStatus>('ACTIVE'); // Default to Active Campaigns Only as requested!
  const [objectiveFilter, setObjectiveFilter] = useState<string>('ALL');
  const [pageFilter, setPageFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Extract unique Facebook Page names from current campaigns
  const availablePages = useMemo(() => {
    const set = new Set<string>();
    campaigns.forEach(c => {
      if (c.pageName) set.add(c.pageName);
    });
    return Array.from(set);
  }, [campaigns]);

  // Save settings when updated
  const updateSettings = useCallback((newSettings: Partial<ApiSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem('meta_dashboard_settings', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save settings to localStorage', e);
      }
      return updated;
    });
  }, []);

  // Fetch / Sync function
  const refreshData = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (settings.isLiveMode && settings.accessToken && settings.adAccountId) {
      const res = await fetchMetaCampaigns(settings);
      if (res.error) {
        setError(res.error);
      } else if (res.campaigns) {
        setCampaigns(res.campaigns);
      }
    } else {
      // In Mock Mode: apply live jittering to simulate active campaigns ticking
      setCampaigns(prev => jitterMockCampaigns(prev));
    }

    setLastUpdated(new Date());
    setLoading(false);
  }, [settings]);

  // Initial fetch and auto-refresh timer setup
  useEffect(() => {
    refreshData();

    if (settings.autoRefreshInterval > 0) {
      const intervalMs = settings.autoRefreshInterval * 1000;
      const timer = setInterval(() => {
        refreshData();
      }, intervalMs);
      return () => clearInterval(timer);
    }
  }, [refreshData, settings.autoRefreshInterval]);

  // Filtered campaigns
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter(cmp => {
      // Status filter
      if (statusFilter !== 'ALL' && cmp.status !== statusFilter) {
        return false;
      }
      // Objective filter
      if (objectiveFilter !== 'ALL' && cmp.objectiveCategory !== objectiveFilter) {
        return false;
      }
      // Facebook Page filter
      if (pageFilter !== 'ALL' && cmp.pageName !== pageFilter) {
        return false;
      }
      // Search filter
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchName = cmp.name.toLowerCase().includes(q);
        const matchId = cmp.id.toLowerCase().includes(q);
        const matchObj = cmp.objective.toLowerCase().includes(q);
        const matchPage = (cmp.pageName || '').toLowerCase().includes(q);
        if (!matchName && !matchId && !matchObj && !matchPage) return false;
      }
      return true;
    });
  }, [campaigns, statusFilter, objectiveFilter, pageFilter, searchQuery]);

  // Dashboard summary metrics calculation
  const summary: DashboardSummary = useMemo(() => {
    let totalSpent = 0;
    let totalBudget = 0;
    let totalImpressions = 0;
    let totalClicks = 0;
    let totalResults = 0;
    let activeCampaignsCount = 0;

    const resultsByObjective: Record<ObjectiveCategory, number> = {
      LEADS: 0,
      SALES: 0,
      MESSAGES: 0,
      TRAFFIC: 0,
      AWARENESS: 0,
      ENGAGEMENT: 0,
      APP_PROMOTION: 0,
      OTHER: 0
    };

    const spendByObjective: Record<ObjectiveCategory, number> = {
      LEADS: 0,
      SALES: 0,
      MESSAGES: 0,
      TRAFFIC: 0,
      AWARENESS: 0,
      ENGAGEMENT: 0,
      APP_PROMOTION: 0,
      OTHER: 0
    };

    // Calculate metrics across ALL campaigns or filtered active set
    campaigns.forEach(cmp => {
      if (cmp.status === 'ACTIVE') activeCampaignsCount++;
      
      totalSpent += cmp.amountSpent;
      const budget = cmp.dailyBudget || cmp.lifetimeBudget || 0;
      totalBudget += budget;
      totalImpressions += cmp.impressions;
      totalClicks += cmp.clicks;
      totalResults += cmp.primaryResult.count;

      const cat = cmp.objectiveCategory;
      resultsByObjective[cat] = (resultsByObjective[cat] || 0) + cmp.primaryResult.count;
      spendByObjective[cat] = (spendByObjective[cat] || 0) + cmp.amountSpent;
    });

    const avgCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
    const avgCpc = totalClicks > 0 ? totalSpent / totalClicks : 0;

    return {
      totalCampaigns: campaigns.length,
      activeCampaignsCount,
      totalSpent,
      totalBudget,
      totalImpressions,
      totalClicks,
      avgCtr,
      avgCpc,
      totalResults,
      resultsByObjective,
      spendByObjective
    };
  }, [campaigns]);

  return {
    campaigns: filteredCampaigns,
    allCampaigns: campaigns,
    summary,
    loading,
    error,
    lastUpdated,
    settings,
    statusFilter,
    objectiveFilter,
    pageFilter,
    availablePages,
    searchQuery,
    setStatusFilter,
    setObjectiveFilter,
    setPageFilter,
    setSearchQuery,
    updateSettings,
    refreshData
  };
}
