import type { NormalizedCampaign } from '../types/meta';

export const INITIAL_MOCK_CAMPAIGNS: NormalizedCampaign[] = [
  {
    id: 'act_cmp_001',
    name: '🔥 LeadGen - Sri Lanka Real Estate VIP Promo',
    status: 'ACTIVE',
    objective: 'OUTCOME_LEADS',
    objectiveCategory: 'LEADS',
    dailyBudget: 45.00,
    lifetimeBudget: 0,
    budgetType: 'DAILY',
    amountSpent: 28.40,
    remainingBudget: 16.60,
    spentPercentage: 63.1,
    impressions: 14850,
    clicks: 620,
    ctr: 4.18,
    cpc: 0.046,
    cpm: 1.91,
    reach: 11200,
    frequency: 1.32,
    primaryResult: {
      name: 'Leads',
      count: 42,
      costPerResult: 0.676,
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
    dailyBudget: 120.00,
    lifetimeBudget: 0,
    budgetType: 'DAILY',
    amountSpent: 94.50,
    remainingBudget: 25.50,
    spentPercentage: 78.75,
    impressions: 38200,
    clicks: 1420,
    ctr: 3.72,
    cpc: 0.066,
    cpm: 2.47,
    reach: 29500,
    frequency: 1.29,
    primaryResult: {
      name: 'Purchases',
      count: 18,
      costPerResult: 5.25,
      value: 684.00,
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
    dailyBudget: 25.00,
    lifetimeBudget: 0,
    budgetType: 'DAILY',
    amountSpent: 16.80,
    remainingBudget: 8.20,
    spentPercentage: 67.2,
    impressions: 9400,
    clicks: 310,
    ctr: 3.30,
    cpc: 0.054,
    cpm: 1.78,
    reach: 8100,
    frequency: 1.16,
    primaryResult: {
      name: 'Messaging Convs.',
      count: 36,
      costPerResult: 0.466,
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
    dailyBudget: 30.00,
    lifetimeBudget: 0,
    budgetType: 'DAILY',
    amountSpent: 21.10,
    remainingBudget: 8.90,
    spentPercentage: 70.33,
    impressions: 18400,
    clicks: 890,
    ctr: 4.84,
    cpc: 0.023,
    cpm: 1.14,
    reach: 15600,
    frequency: 1.18,
    primaryResult: {
      name: 'Link Clicks',
      count: 890,
      costPerResult: 0.023,
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
    dailyBudget: 50.00,
    lifetimeBudget: 0,
    budgetType: 'DAILY',
    amountSpent: 42.00,
    remainingBudget: 8.00,
    spentPercentage: 84.0,
    impressions: 54000,
    clicks: 420,
    ctr: 0.78,
    cpc: 0.10,
    cpm: 0.777,
    reach: 42100,
    frequency: 1.28,
    primaryResult: {
      name: 'Reach',
      count: 42100,
      costPerResult: 0.997,
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
    lifetimeBudget: 500.00,
    budgetType: 'LIFETIME',
    amountSpent: 310.00,
    remainingBudget: 190.00,
    spentPercentage: 62.0,
    impressions: 62000,
    clicks: 2100,
    ctr: 3.38,
    cpc: 0.147,
    cpm: 5.00,
    reach: 48000,
    frequency: 1.29,
    primaryResult: {
      name: 'App Installs',
      count: 245,
      costPerResult: 1.265,
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

    // Small random spend increase between $0.05 and $0.40 per tick
    const deltaSpend = parseFloat((Math.random() * 0.35 + 0.05).toFixed(2));
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
        const saleValue = Math.floor(Math.random() * 45 + 25);
        newValue = (newValue || 0) + saleValue;
      }
    }

    const newCtr = newImp > 0 ? parseFloat(((newClicks / newImp) * 100).toFixed(2)) : cmp.ctr;
    const newCpc = newClicks > 0 ? parseFloat((newSpent / newClicks).toFixed(3)) : cmp.cpc;
    const newCpm = newImp > 0 ? parseFloat(((newSpent / newImp) * 1000).toFixed(3)) : cmp.cpm;
    const newCpr = newResultCount > 0 ? parseFloat((newSpent / newResultCount).toFixed(3)) : cmp.primaryResult.costPerResult;
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
