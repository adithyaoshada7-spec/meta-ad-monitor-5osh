import type { 
  RawMetaCampaign, 
  NormalizedCampaign, 
  ObjectiveCategory, 
  PrimaryResult, 
  MetaAction,
  MetaInsightData 
} from '../types/meta';

/**
 * Safely parse numeric string or number with optional fallback
 */
function safeNum(val: any, fallback = 0): number {
  if (val === undefined || val === null || val === '') return fallback;
  const parsed = typeof val === 'number' ? val : parseFloat(String(val));
  return isNaN(parsed) ? fallback : parsed;
}

/**
 * Helper to safely retrieve action counts across multiple possible action_type strings
 */
function getActionCount(actions: MetaAction[] = [], typeCandidates: string[]): number {
  if (!Array.isArray(actions)) return 0;
  
  for (const candidate of typeCandidates) {
    const found = actions.find(a => a && a.action_type === candidate);
    if (found) {
      return safeNum(found.value, 0);
    }
  }
  
  // Secondary fuzzy match if exact fails
  for (const candidate of typeCandidates) {
    const fuzzy = actions.find(a => a && a.action_type && a.action_type.includes(candidate));
    if (fuzzy) {
      return safeNum(fuzzy.value, 0);
    }
  }

  return 0;
}

/**
 * Helper to safely retrieve action financial value (e.g. Purchase monetary value)
 */
function getActionValue(actionValues: MetaAction[] = [], typeCandidates: string[]): number {
  if (!Array.isArray(actionValues)) return 0;
  
  for (const candidate of typeCandidates) {
    const found = actionValues.find(a => a && a.action_type === candidate);
    if (found) {
      return safeNum(found.value, 0);
    }
  }
  return 0;
}

/**
 * Classify raw Meta API objective string into standard UI category
 */
export function classifyObjective(rawObjective: string = ''): ObjectiveCategory {
  const obj = (rawObjective || '').toUpperCase();
  
  if (obj.includes('LEAD') || obj === 'OUTCOME_LEADS') return 'LEADS';
  if (obj.includes('SALE') || obj.includes('CONVERSION') || obj === 'OUTCOME_SALES' || obj.includes('PRODUCT_CATALOG')) return 'SALES';
  if (obj.includes('MESSAGE') || obj.includes('MESSAGING') || obj.includes('WHATSAPP')) return 'MESSAGES';
  if (obj.includes('TRAFFIC') || obj.includes('LINK_CLICK') || obj === 'OUTCOME_TRAFFIC') return 'TRAFFIC';
  if (obj.includes('AWARENESS') || obj.includes('REACH') || obj === 'OUTCOME_AWARENESS' || obj.includes('BRAND')) return 'AWARENESS';
  if (obj.includes('ENGAGEMENT') || obj.includes('POST_ENGAGEMENT') || obj.includes('VIDEO') || obj === 'OUTCOME_ENGAGEMENT') return 'ENGAGEMENT';
  if (obj.includes('APP') || obj === 'OUTCOME_APP_PROMOTION') return 'APP_PROMOTION';
  
  return 'OTHER';
}

/**
 * Extract primary objective metric, result count, CPR, and revenue safely
 */
export function extractPrimaryResult(
  _objective: string,
  category: ObjectiveCategory,
  insight: MetaInsightData,
  spend: number
): PrimaryResult {
  const actions = insight?.actions || [];
  const actionValues = insight?.action_values || [];
  const clicks = safeNum(insight?.clicks, 0);
  const impressions = safeNum(insight?.impressions, 0);

  switch (category) {
    case 'LEADS': {
      const leadCandidates = [
        'lead', 
        'offsite_conversion.fb_pixel_lead', 
        'leadgen_grouped', 
        'onsite_conversion.lead_grouped'
      ];
      const count = getActionCount(actions, leadCandidates);
      const cpr = count > 0 ? spend / count : 0;
      return {
        name: 'Leads',
        count,
        costPerResult: cpr,
        unitLabel: 'Lead'
      };
    }

    case 'SALES': {
      const purchaseCandidates = [
        'purchase', 
        'offsite_conversion.fb_pixel_purchase', 
        'omni_purchase'
      ];
      const count = getActionCount(actions, purchaseCandidates);
      const revenue = getActionValue(actionValues, purchaseCandidates);
      const cpr = count > 0 ? spend / count : 0;
      const roas = spend > 0 && revenue > 0 ? revenue / spend : 0;
      return {
        name: 'Purchases',
        count,
        costPerResult: cpr,
        value: revenue,
        roas,
        unitLabel: 'Purchase'
      };
    }

    case 'MESSAGES': {
      const msgCandidates = [
        'onsite_conversion.messaging_conversation_started_7d',
        'onsite_conversion.messaging_first_reply',
        'messaging_conversation_started_7d',
        'messaging_user_initiated_conversation'
      ];
      const count = getActionCount(actions, msgCandidates);
      const cpr = count > 0 ? spend / count : 0;
      return {
        name: 'Messaging Convs.',
        count,
        costPerResult: cpr,
        unitLabel: 'Conv.'
      };
    }

    case 'TRAFFIC': {
      const clickCandidates = [
        'link_click', 
        'outbound_click', 
        'landing_page_view'
      ];
      let count = getActionCount(actions, clickCandidates);
      if (count === 0 && clicks > 0) {
        count = clicks;
      }
      const cpr = count > 0 ? spend / count : (clicks > 0 ? spend / clicks : 0);
      return {
        name: 'Link Clicks',
        count,
        costPerResult: cpr,
        unitLabel: 'Click'
      };
    }

    case 'AWARENESS': {
      const reach = safeNum(insight?.reach, impressions);
      const cpr = reach > 0 ? (spend / reach) * 1000 : 0; // CPM / Cost per 1k Reach
      return {
        name: 'Reach',
        count: reach,
        costPerResult: cpr,
        unitLabel: '1k Reach'
      };
    }

    case 'ENGAGEMENT': {
      const engCandidates = [
        'post_engagement', 
        'page_engagement', 
        'video_view', 
        'post_reaction',
        'like'
      ];
      let count = getActionCount(actions, engCandidates);
      if (count === 0 && clicks > 0) count = clicks;
      const cpr = count > 0 ? spend / count : 0;
      return {
        name: 'Engagements',
        count,
        costPerResult: cpr,
        unitLabel: 'Eng.'
      };
    }

    case 'APP_PROMOTION': {
      const appCandidates = ['mobile_app_install', 'app_custom_event'];
      const count = getActionCount(actions, appCandidates);
      const cpr = count > 0 ? spend / count : 0;
      return {
        name: 'App Installs',
        count,
        costPerResult: cpr,
        unitLabel: 'Install'
      };
    }

    default: {
      // General fallback to Clicks or Impressions
      const count = clicks > 0 ? clicks : impressions;
      const cpr = count > 0 ? spend / count : 0;
      return {
        name: clicks > 0 ? 'Clicks' : 'Impressions',
        count,
        costPerResult: cpr,
        unitLabel: clicks > 0 ? 'Click' : 'Imp.'
      };
    }
  }
}

/**
 * Normalizes raw Meta Campaign API payload into a unified, crash-safe UI representation
 */
export function normalizeMetaCampaign(raw: RawMetaCampaign): NormalizedCampaign {
  const insight: MetaInsightData = raw.insights?.data?.[0] || {};
  
  const rawStatus = (raw.effective_status || raw.status || 'PAUSED').toUpperCase();
  const status = rawStatus.includes('ACTIVE') ? 'ACTIVE' : (rawStatus.includes('ARCHIVED') ? 'ARCHIVED' : 'PAUSED');
  
  const rawObjective = raw.objective || 'UNKNOWN';
  const category = classifyObjective(rawObjective);

  const amountSpent = safeNum(insight.spend, 0);

  // Normalize budget: Meta API returns budget in cents (e.g. 10000 = $100.00) or decimal string depending on endpoint
  let dailyBudget = safeNum(raw.daily_budget, 0);
  let lifetimeBudget = safeNum(raw.lifetime_budget, 0);

  // Heuristic: Meta budgets from graph API are often in cents if > 1000 and integer-like
  if (dailyBudget > 10000) dailyBudget = dailyBudget / 100;
  if (lifetimeBudget > 10000) lifetimeBudget = lifetimeBudget / 100;

  let budgetType: 'DAILY' | 'LIFETIME' | 'UNLIMITED' = 'UNLIMITED';
  let totalBudget = 0;

  if (dailyBudget > 0) {
    budgetType = 'DAILY';
    totalBudget = dailyBudget;
  } else if (lifetimeBudget > 0) {
    budgetType = 'LIFETIME';
    totalBudget = lifetimeBudget;
  }

  const remainingBudget = totalBudget > 0 ? Math.max(0, totalBudget - amountSpent) : 0;
  const spentPercentage = totalBudget > 0 ? Math.min(100, (amountSpent / totalBudget) * 100) : 0;

  const impressions = safeNum(insight.impressions, 0);
  const clicks = safeNum(insight.clicks, 0);
  const reach = safeNum(insight.reach, 0);
  const frequency = safeNum(insight.frequency, impressions > 0 && reach > 0 ? impressions / reach : 1);

  const ctr = safeNum(insight.ctr, impressions > 0 ? (clicks / impressions) * 100 : 0);
  const cpc = safeNum(insight.cpc, clicks > 0 ? amountSpent / clicks : 0);
  const cpm = safeNum(insight.cpm, impressions > 0 ? (amountSpent / impressions) * 1000 : 0);

  const primaryResult = extractPrimaryResult(rawObjective, category, insight, amountSpent);

  // Extract Page Name & ID if available from raw API payload or infer clean fallback
  const rawAny = raw as any;
  const pageName = rawAny.promoted_object?.page_name || rawAny.page_name || rawAny.promoter_page_name || 'Main Facebook Page';
  const pageId = rawAny.promoted_object?.page_id || rawAny.page_id || 'page_default';

  return {
    id: raw.id || `cmp_${Math.random().toString(36).substr(2, 9)}`,
    name: raw.name || 'Unnamed Campaign',
    status,
    objective: rawObjective,
    objectiveCategory: category,
    dailyBudget,
    lifetimeBudget,
    budgetType,
    amountSpent,
    remainingBudget,
    spentPercentage,
    impressions,
    clicks,
    ctr,
    cpc,
    cpm,
    reach,
    frequency,
    primaryResult,
    pageName,
    pageId,
    updatedAt: new Date().toISOString()
  };
}
