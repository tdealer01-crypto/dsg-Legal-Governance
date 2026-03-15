import React, { useState } from 'react';
import { Key, Copy, CheckCircle2, Zap, Shield, Server, CreditCard, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface APIKey {
  id: string;
  key: string;
  createdAt: string;
  lastUsed: string | null;
  status: 'active' | 'revoked';
}

interface Props {
  keys: APIKey[];
  onGenerateKey: () => void;
  usageCount: number;
}

export default function DeveloperPortal({ keys, onGenerateKey, usageCount }: Props) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const generateKey = () => {
    setIsGenerating(true);
    setTimeout(() => {
      onGenerateKey();
      setIsGenerating(false);
    }, 800);
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
            <Key className="text-emerald-500" size={36} />
            API KEYS & ENDPOINTS
          </h1>
          <p className="text-zinc-400 uppercase text-[10px] tracking-[0.2em]">
            Manage your DSG-Makk8 Gateway Access
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Usage & Keys */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Plan & Usage */}
          <div className="p-6 bg-[#0F0F11] border border-emerald-500/30 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full" />
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-black text-white">Free Tier Active</h2>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-500 text-[10px] font-bold rounded uppercase tracking-wider">
                    Default
                  </span>
                </div>
                <p className="text-sm text-zinc-400">You are currently on the free developer tier.</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Requests Used</p>
                <p className="text-2xl font-black text-white">{usageCount.toLocaleString()} <span className="text-sm text-zinc-500">/ 10,000</span></p>
              </div>
            </div>

            <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden relative z-10">
              <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${Math.max(2, (usageCount / 10000) * 100)}%` }} />
            </div>
            <p className="text-[10px] text-zinc-500 mt-2 text-right relative z-10">Resets in 30 days</p>
          </div>

          {/* API Keys Management */}
          <div className="p-6 bg-[#0F0F11] border border-white/5 rounded-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold uppercase text-zinc-400">Your Secret Keys</h3>
              <button
                onClick={generateKey}
                disabled={isGenerating}
                className="px-4 py-2 bg-emerald-500 text-black text-xs font-bold rounded-lg hover:bg-emerald-400 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isGenerating ? (
                  <div className="w-3 h-3 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <Key size={14} />
                )}
                Generate New Key
              </button>
            </div>

            {keys.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-white/10 rounded-xl">
                <Key size={32} className="mx-auto mb-3 text-zinc-600" />
                <p className="text-sm text-zinc-400 mb-4">No API keys generated yet.</p>
                <p className="text-xs text-zinc-500">Generate a key to start authenticating your agents.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence>
                  {keys.map((k) => (
                    <motion.div
                      key={k.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between p-4 bg-black/30 border border-white/5 rounded-xl group"
                    >
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-mono text-sm text-emerald-400">{k.key.substring(0, 12)}...{k.key.substring(k.key.length - 4)}</span>
                          <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[8px] font-bold rounded uppercase">
                            {k.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-500">Created: {k.createdAt}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => copyToClipboard(k.id, k.key)}
                          className="p-2 text-zinc-400 hover:text-white bg-white/5 rounded-lg transition-colors"
                          title="Copy to clipboard"
                        >
                          {copiedId === k.id ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Copy size={16} />}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Endpoint Documentation */}
          <div className="p-6 bg-[#0F0F11] border border-white/5 rounded-2xl">
            <h3 className="text-sm font-bold uppercase text-zinc-400 mb-4">API Endpoint</h3>
            <div className="bg-black/50 p-4 rounded-xl border border-white/5 font-mono text-xs text-zinc-300 mb-4">
              POST https://api.dsg-makk8.com/v1/evaluate
            </div>
            <div className="bg-black/50 p-4 rounded-xl border border-white/5 font-mono text-xs text-zinc-400 overflow-x-auto">
              <pre>{`curl -X POST https://api.dsg-makk8.com/v1/evaluate \\
  -H "Authorization: Bearer ${keys.length > 0 ? keys[0].key : 'dsg_live_...'}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "agent_action": {"tool": "execute_sql", "query": "SELECT * FROM users"}
  }'`}</pre>
            </div>
          </div>
        </div>

        {/* Right Column: Upgrade Plans */}
        <div className="space-y-4">
          <div className="p-6 bg-gradient-to-b from-zinc-900 to-[#0F0F11] border border-white/5 rounded-2xl">
            <h3 className="text-sm font-bold uppercase text-white mb-2 flex items-center gap-2">
              <Zap size={16} className="text-amber-500" /> Upgrade Plan
            </h3>
            <p className="text-xs text-zinc-400 mb-6">Unlock higher rate limits and enterprise governance features.</p>

            <div className="space-y-4">
              {/* Pro Plan */}
              <div className="p-4 border border-white/10 rounded-xl hover:border-amber-500/50 transition-colors cursor-pointer group">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-white group-hover:text-amber-500 transition-colors">Developer Pro</h4>
                  <span className="text-lg font-black text-white">$49<span className="text-xs text-zinc-500 font-normal">/mo</span></span>
                </div>
                <ul className="text-[10px] text-zinc-400 space-y-1">
                  <li>• 100,000 Requests / month</li>
                  <li>• Standard Z3 Verification</li>
                  <li>• Community Support</li>
                </ul>
              </div>

              {/* Enterprise Plan */}
              <div className="p-4 border border-emerald-500/30 bg-emerald-500/5 rounded-xl hover:border-emerald-500 transition-colors cursor-pointer group relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-emerald-500 text-black text-[8px] font-black px-2 py-0.5 rounded-bl-lg">POPULAR</div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-white group-hover:text-emerald-500 transition-colors">Enterprise</h4>
                  <span className="text-lg font-black text-white">$199<span className="text-xs text-zinc-500 font-normal">/mo</span></span>
                </div>
                <ul className="text-[10px] text-zinc-400 space-y-1">
                  <li>• 1,000,000 Requests / month</li>
                  <li>• Advanced Makk8 Tuning</li>
                  <li>• Priority SLA</li>
                </ul>
              </div>

              {/* Governance Plan */}
              <div className="p-4 border border-purple-500/30 bg-purple-500/5 rounded-xl hover:border-purple-500 transition-colors cursor-pointer group">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-white group-hover:text-purple-500 transition-colors">Governance</h4>
                  <span className="text-lg font-black text-white">$1,290<span className="text-xs text-zinc-500 font-normal">/mo</span></span>
                </div>
                <ul className="text-[10px] text-zinc-400 space-y-1">
                  <li>• Unlimited Requests</li>
                  <li>• Custom Invariant Deployment</li>
                  <li>• Dedicated Account Manager</li>
                  <li>• On-premise Deployment Option</li>
                </ul>
              </div>
            </div>

            <button className="w-full mt-6 py-3 bg-white text-black text-xs font-bold rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2">
              <CreditCard size={16} /> Manage Billing
            </button>
          </div>
          
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-start gap-3">
            <AlertCircle size={16} className="text-blue-500 shrink-0 mt-0.5" />
            <p className="text-[10px] text-blue-200 leading-relaxed">
              <strong>UDG V159 Integration:</strong> Your API keys are fully compatible with the UDG V159 (KAI) Mission Control architecture. Use these keys in your Secret Manager.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
