import React, { useState } from 'react';
import { 
  X, 
  Key, 
  CheckCircle2, 
  AlertCircle, 
  Globe, 
  Sparkles,
  RefreshCw
} from 'lucide-react';
import type { ApiSettings } from '../types/meta';
import { testMetaConnection } from '../services/metaApi';

interface SettingsModalProps {
  isOpen: boolean;
  settings: ApiSettings;
  onClose: () => void;
  onSave: (newSettings: ApiSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  settings,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<ApiSettings>(settings);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [testing, setTesting] = useState(false);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    if (!formData.accessToken || !formData.adAccountId) {
      setTestResult({
        success: false,
        message: 'Please enter Access Token and Ad Account ID first.'
      });
      return;
    }

    setTesting(true);
    setTestResult(null);
    const result = await testMetaConnection(formData);
    setTestResult(result);
    setTesting(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Meta Graph API Settings</h3>
              <p className="text-xs text-slate-400">Configure Facebook Access Token & Account Credentials</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          
          {/* Data Source Toggle */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <div>
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Live API vs Demo Mode
              </label>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {formData.isLiveMode 
                  ? 'Currently fetching real-time data directly from Meta Graph API.' 
                  : 'Currently running on simulated live data (No API Key required).'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, isLiveMode: !prev.isLiveMode }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                formData.isLiveMode ? 'bg-indigo-600' : 'bg-slate-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.isLiveMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Ad Account ID */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Ad Account ID <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              placeholder="act_123456789012345"
              value={formData.adAccountId}
              onChange={(e) => setFormData(prev => ({ ...prev, adAccountId: e.target.value }))}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
            />
            <p className="text-[10px] text-slate-500 mt-1">Found in Meta Ads Manager URL: <code className="text-slate-400">act_xxxxxxxxxxxx</code></p>
          </div>

          {/* Access Token */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Meta System User / Access Token <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="EAAxxxxx..."
              value={formData.accessToken}
              onChange={(e) => setFormData(prev => ({ ...prev, accessToken: e.target.value }))}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono resize-none"
            />
            <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
              <span>Requires permissions: <code className="text-indigo-400">ads_read</code>, <code className="text-indigo-400">read_insights</code></span>
              <a 
                href="https://developers.facebook.com/tools/explorer/" 
                target="_blank" 
                rel="noreferrer"
                className="text-indigo-400 hover:underline flex items-center gap-1 font-semibold"
              >
                Graph API Explorer <Globe className="w-3 h-3 inline" />
              </a>
            </div>
          </div>

          {/* Currency Display Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Dashboard Display Currency
            </label>
            <select
              value={formData.currency || 'LKR'}
              onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-semibold"
            >
              <option value="LKR">🇱🇰 LKR - Sri Lankan Rupee (Rs.)</option>
              <option value="USD">🇺🇸 USD - US Dollar ($)</option>
            </select>
          </div>

          {/* Graph API Version */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Meta Graph API Version
            </label>
            <select
              value={formData.apiVersion}
              onChange={(e) => setFormData(prev => ({ ...prev, apiVersion: e.target.value }))}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="v20.0">v20.0 (Latest)</option>
              <option value="v19.0">v19.0</option>
              <option value="v18.0">v18.0</option>
            </select>
          </div>

          {/* Test Connection Result Notice */}
          {testResult && (
            <div className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
              testResult.success 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}>
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div>{testResult.message}</div>
            </div>
          )}

          {/* Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testing}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-indigo-400 ${testing ? 'animate-spin' : ''}`} />
              Test Connection
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-all shadow-lg shadow-indigo-600/20"
              >
                Save Settings
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
