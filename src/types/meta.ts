export type CampaignStatus = 'ACTIVE' | 'PAUSED' | 'ARCHIVED' | 'COMPLETED' | 'ALL';

export type ObjectiveCategory = 
  | 'LEADS'
  | 'SALES'
  | 'MESSAGES'
  | 'TRAFFIC'
  | 'AWARENESS'
  | 'ENGAGEMENT'
  | 'APP_PROMOTION'
  | 'OTHER';

export interface MetaAction {
  action_type: string;
  value: string | number;
}

export interface MetaInsightData {
  impressions?: string;
  clicks?: string;
  spend?: string;
  reach?: string;
  frequency?: string;
  cpc?: string;
  cpm?: string;
  ctr?: string;
  actions?: MetaAction[];
  action_values?: MetaAction[];
  cost_per_action_type?: MetaAction[];
  cost_per_unique_action_type?: MetaAction[];
  date_start?: string;
  date_stop?: string;
}

export interface RawMetaCampaign {
  id: string;
  name: string;
  status: string;
  effective_status?: string;
  objective: string;
  daily_budget?: string | number;
  lifetime_budget?: string | number;
  budget_remaining?: string | number;
  start_time?: string;
  stop_time?: string;
  insights?: {
    data: MetaInsightData[];
  };
}

export interface PrimaryResult {
  name: string;
  count: number;
  costPerResult: number;
  value?: number; // Total conversion value (revenue) for sales objectives
  roas?: number;  // Return on ad spend
  unitLabel: string;
}

export interface NormalizedCampaign {
  id: string;
  name: string;
  status: 'ACTIVE' | 'PAUSED' | 'ARCHIVED' | string;
  objective: string;
  objectiveCategory: ObjectiveCategory;
  dailyBudget: number;
  lifetimeBudget: number;
  budgetType: 'DAILY' | 'LIFETIME' | 'UNLIMITED';
  amountSpent: number;
  remainingBudget: number;
  spentPercentage: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  cpm: number;
  reach: number;
  frequency: number;
  primaryResult: PrimaryResult;
  updatedAt: string;
  isMock?: boolean;
}

export interface DashboardSummary {
  totalCampaigns: number;
  activeCampaignsCount: number;
  totalSpent: number;
  totalBudget: number;
  totalImpressions: number;
  totalClicks: number;
  avgCtr: number;
  avgCpc: number;
  totalResults: number;
  resultsByObjective: Record<ObjectiveCategory, number>;
  spendByObjective: Record<ObjectiveCategory, number>;
}

export interface ApiSettings {
  accessToken: string;
  adAccountId: string; // e.g. act_123456789
  apiVersion: string;   // e.g. v20.0
  isLiveMode: boolean;  // toggle between live Meta API and mock mode
  autoRefreshInterval: number; // in seconds (0 = disabled, 10, 30, 60, 300)
  currency: 'LKR' | 'USD' | string; // Selected display currency
  usdToLkrRate: number; // Conversion rate if converting USD account to LKR (e.g. 300)
}
