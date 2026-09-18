import axios from 'axios';
import type { NormalizedCampaign, ApiSettings, RawMetaCampaign } from '../types/meta';
import { normalizeMetaCampaign } from '../utils/metaNormalizer';

export async function fetchMetaCampaigns(settings: ApiSettings): Promise<{
  campaigns: NormalizedCampaign[];
  error?: string;
}> {
  if (!settings.isLiveMode || !settings.accessToken || !settings.adAccountId) {
    return {
      campaigns: [],
      error: 'API settings incomplete. Switch to Live Mode and provide valid Access Token and Ad Account ID.'
    };
  }

  try {
    const cleanAccountId = settings.adAccountId.trim().startsWith('act_')
      ? settings.adAccountId.trim()
      : `act_${settings.adAccountId.trim()}`;

    const fields = [
      'id',
      'name',
      'status',
      'effective_status',
      'objective',
      'daily_budget',
      'lifetime_budget',
      'budget_remaining',
      'insights.date_preset(today){spend,impressions,clicks,reach,frequency,cpc,cpm,ctr,actions,action_values,cost_per_action_type}'
    ].join(',');

    const url = `https://graph.facebook.com/${settings.apiVersion || 'v20.0'}/${cleanAccountId}/campaigns`;

    const response = await axios.get(url, {
      params: {
        fields,
        access_token: settings.accessToken.trim(),
        limit: 100
      },
      timeout: 15000
    });

    if (response.data && Array.isArray(response.data.data)) {
      const rawList: RawMetaCampaign[] = response.data.data;
      const normalizedList = rawList.map(raw => normalizeMetaCampaign(raw));
      return { campaigns: normalizedList };
    }

    return { campaigns: [], error: 'Meta API returned invalid data format.' };
  } catch (err: any) {
    const apiError = err.response?.data?.error?.message || err.message || 'Failed to connect to Meta Graph API';
    return {
      campaigns: [],
      error: apiError
    };
  }
}

export async function testMetaConnection(settings: ApiSettings): Promise<{ success: boolean; message: string }> {
  try {
    const cleanAccountId = settings.adAccountId.trim().startsWith('act_')
      ? settings.adAccountId.trim()
      : `act_${settings.adAccountId.trim()}`;

    const url = `https://graph.facebook.com/${settings.apiVersion || 'v20.0'}/${cleanAccountId}`;
    
    const response = await axios.get(url, {
      params: {
        fields: 'id,name,account_status,currency',
        access_token: settings.accessToken.trim()
      },
      timeout: 10000
    });

    if (response.data && response.data.id) {
      return {
        success: true,
        message: `Successfully connected to Ad Account: ${response.data.name || response.data.id} (${response.data.currency || 'USD'})`
      };
    }

    return { success: false, message: 'Could not verify Ad Account.' };
  } catch (err: any) {
    const msg = err.response?.data?.error?.message || err.message || 'Connection failed';
    return { success: false, message: msg };
  }
}
