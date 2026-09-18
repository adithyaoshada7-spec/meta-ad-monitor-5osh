import type { NormalizedCampaign } from '../types/meta';

export const INITIAL_MOCK_CAMPAIGNS: NormalizedCampaign[] = [
  {
    id: 'act_cmp_001',
    name: '🔥 LeadGen - Sri Lanka Real Estate VIP Promo',
    status: 'ACTIVE',
    objective: 'OUTCOME_LEADS',
    objectiveCategory: 'LEADS',
    dailyBudget: 4500.00,
    lifetimeBudget: 0,
    budgetType: 'DAILY',
    amountSpent: 2840.00,
    remainingBudget: 1660.00,
    spentPercentage: 63.1,
    impressions: 14850,
    clicks: 620,
    ctr: 4.18,
    cpc: 4.58,
    cpm: 191.20,
    reach: 11200,
    frequency: 1.32,
    primaryResult: {
      name: 'Leads',
      count: 42,
      costPerResult: 67.62,
      unitLabel: 'Lead'
    },
    updatedAt: new Date().toISOString(),
    isMock: true
  },
  {
    id: 'act_cmp_002',
    name: '🛒 Ecommerce Sales - Flash Sale Apparel',
    status: 'ACTIVE',
    objective: 'OUTCOME_SALES',
    objectiveCategory: 'SALES',
    dailyBudget: 12000.00,
    lifetimeBudget: 0,
    budgetType: 'DAILY',
    amountSpent: 9450.00,
    remainingBudget: 2550.00,
    spentPercentage: 78.75,
    impressions: 38200,
    clicks: 1420,
    ctr: 3.72,
    cpc: 6.65,
    cpm: 247.38,
    reach: 29500,
    frequency: 1.29,
    primaryResult: {
      name: 'Purchases',
      count: 18,
      costPerResult: 525.00,
      value: 68400.00,
      roas: 7.24,
      unitLabel: 'Purchase'
    },
    updatedAt: new Date().toISOString(),
    isMock: true
  },
  {
    id: 'act_cmp_003',
    name: '💬 WhatsApp Ads - Direct Inquiry Campaign',
    status: 'ACTIVE',
    objective: 'OUTCOME_ENGAGEMENT',
    objectiveCategory: 'MESSAGES',
    dailyBudget: 2500.00,
    lifetimeBudget: 0,
    budgetType: 'DAILY',
    amountSpent: 1680.00,
    remainingBudget: 820.00,
    spentPercentage: 67.2,
    impressions: 9400,
    clicks: 310,
    ctr: 3.30,
    cpc: 5.42,
    cpm: 178.72,
    reach: 8100,
    frequency: 1.16,
    primaryResult: {
      name: 'Messaging Convs.',
      count: 36,
      costPerResult: 46.66,
      unitLabel: 'Conv.'
    },
    updatedAt: new Date().toISOString(),
    isMock: true
  },
  {
    id: 'act_cmp_004',
    name: '🚀 Traffic - New Blog Launch & Website Clicks',
    status: 'ACTIVE',
    objective: 'OUTCOME_TRAFFIC',
    objectiveCategory: 'TRAFFIC',
    dailyBudget: 3000.00,
    lifetimeBudget: 0,
    budgetType: 'DAILY',
    amountSpent: 2110.00,
    remainingBudget: 890.00,
    spentPercentage: 70.33,
    impressions: 18400,
    clicks: 890,
    ctr: 4.84,
    cpc: 2.37,
    cpm: 114.67,
    reach: 15600,
    frequency: 1.18,
    primaryResult: {
      name: 'Link Clicks',
      count: 890,
      costPerResult: 2.37,
      unitLabel: 'Click'
    },
    updatedAt: new Date().toISOString(),
    isMock: true
  },
  {
    id: 'act_cmp_005',
    name: '📢 Brand Reach - Islandwide Awareness Video',
    status: 'ACTIVE',
    objective: 'OUTCOME_AWARENESS',
    objectiveCategory: 'AWARENESS',
    dailyBudget: 5000.00,
    lifetimeBudget: 0,
    budgetType: 'DAILY',
    amountSpent: 4200.00,
    remainingBudget: 800.00,
    spentPercentage: 84.0,
    impressions: 54000,
    clicks: 420,
    ctr: 0.78,
    cpc: 10.00,
    cpm: 77.77,
    reach: 42100,
    frequency: 1.28,
    primaryResult: {
      name: 'Reach',
      count: 42100,
      costPerResult: 99.76,
      unitLabel: '1k Reach'
    },
    updatedAt: new Date().toISOString(),
    isMock: true
  },
  {
    id: 'act_cmp_006',
    name: '📱 Mobile App Installs - iOS & Android Launch',
    status: 'PAUSED',
    objective: 'OUTCOME_APP_PROMOTION',
    objectiveCategory: 'APP_PROMOTION',
    dailyBudget: 0,
    lifetimeBudget: 50000.00,
    budgetType: 'LIFETIME',
    amountSpent: 31000.00,
    remainingBudget: 19000.00,
    spentPercentage: 62.0,
    impressions: 62000,
    clicks: 2100,
    ctr: 3.38,
    cpc: 14.76,
    cpm: 500.00,
    reach: 48000,
    frequency: 1.29,
    primaryResult: {
      name: 'App Installs',
      count: 245,
      costPerResult: 126.53,
      unitLabel: 'Install'
    },
    updatedAt: new Date().toISOString(),
    isMock: true
  }
];

/**
 * Simulate live realtime data changes (ticks) on mock campaigns
 */
export function jitterMockCampaigns(campaigns: NormalizedCampaign[]): NormalizedCampaign[] {
  return campaigns.map(cmp => {
    // Only tick active campaigns to simulate real ad activity
    if (cmp.status !== 'ACTIVE') return cmp;

    // Small random spend increase in LKR (Rs. 5 - 35) per tick
    const deltaSpend = parseFloat((Math.random() * 30 + 5).toFixed(2));
    const newSpent = parseFloat((cmp.amountSpent + deltaSpend).toFixed(2));
    
    // Impressions tick up by 30-150
    const deltaImp = Math.floor(Math.random() * 120 + 30);
    const newImp = cmp.impressions + deltaImp;

    // Clicks tick up by 1-5
    const deltaClicks = Math.floor(Math.random() * 5 + 1);
    const newClicks = cmp.clicks + deltaClicks;

    // Primary result tick (30% chance per tick)
    let newResultCount = cmp.primaryResult.count;
    let newValue = cmp.primaryResult.value;
    if (Math.random() > 0.65) {
      newResultCount += 1;
      if (cmp.objectiveCategory === 'SALES') {
        const saleValue = Math.floor(Math.random() * 4500 + 2500);
        newValue = (newValue || 0) + saleValue;
      }
    }

    const newCtr = newImp > 0 ? parseFloat(((newClicks / newImp) * 100).toFixed(2)) : cmp.ctr;
    const newCpc = newClicks > 0 ? parseFloat((newSpent / newClicks).toFixed(2)) : cmp.cpc;
    const newCpm = newImp > 0 ? parseFloat(((newSpent / newImp) * 1000).toFixed(2)) : cmp.cpm;
    const newCpr = newResultCount > 0 ? parseFloat((newSpent / newResultCount).toFixed(2)) : cmp.primaryResult.costPerResult;
    const newRoas = newSpent > 0 && newValue ? parseFloat((newValue / newSpent).toFixed(2)) : cmp.primaryResult.roas;

    const totalBudget = cmp.dailyBudget || cmp.lifetimeBudget || 0;
    const remaining = totalBudget > 0 ? Math.max(0, parseFloat((totalBudget - newSpent).toFixed(2))) : 0;
    const spentPct = totalBudget > 0 ? parseFloat(Math.min(100, (newSpent / totalBudget) * 100).toFixed(1)) : 0;

    return {
      ...cmp,
      amountSpent: newSpent,
      remainingBudget: remaining,
      spentPercentage: spentPct,
      impressions: newImp,
      clicks: newClicks,
      ctr: newCtr,
      cpc: newCpc,
      cpm: newCpm,
      primaryResult: {
        ...cmp.primaryResult,
        count: newResultCount,
        costPerResult: newCpr,
        value: newValue,
        roas: newRoas
      },
      updatedAt: new Date().toISOString()
    };
  });
}
