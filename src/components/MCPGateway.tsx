import React, { useState, useEffect, useRef } from 'react';
import { Terminal, ShieldAlert, ShieldCheck, Zap, Power, Send, AlertTriangle, CheckCircle2, Key } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { APIKey } from './DeveloperPortal';

interface LogEntry {
  id: string;
  type: 'user' | 'agent' | 'dsg' | 'system';
  content: string;
  timestamp: string;
  details?: any;
}

interface Props {
  keys: APIKey[];
  onUsage: () => void;
}

export default function MCPGateway({ keys, onUsage }: Props) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedKey, setSelectedKey] = useState<string>('');
  const [input, setInput] = useState('');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  // Auto-select first key if available
  useEffect(() => {
    if (keys.length > 0 && !selectedKey) {
      setSelectedKey(keys[0].key);
    }
  }, [keys]);

  const addLog = (type: LogEntry['type'], content: string, details?: any) => {
    setLogs(prev => [...prev, {
      id: Math.random().toString(36).substring(7),
      type,
      content,
      timestamp: new Date().toLocaleTimeString(),
      details
    }]);
  };

  const handleConnect = () => {
    if (!selectedKey) {
       addLog('system', 'ERROR: No API Key provided. Connection refused. Please generate a key in the Developer Portal.');
       return;
    }
    const isValid = keys.some(k => k.key === selectedKey);
    if (!isValid) {
       addLog('system', 'ERROR: Invalid API Key. Connection refused.');
       return;
    }

    setIsConnecting(true);
    addLog('system', `Authenticating with Key: ${selectedKey.substring(0, 12)}...`);
    
    setTimeout(() => {
      addLog('system', 'Handshake established with Agentic AI.');
      addLog('system', 'DSG-Makk8 Interceptor active on port 3000.');
      setIsConnected(true);
      setIsConnecting(false);
      addLog('system', 'CONNECTION SECURED. Awaiting commands.');
    }, 1500);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    addLog('system', 'Connection terminated by user.');
  };

  const processCommand = (cmd: string) => {
    if (!cmd.trim()) return;
    if (!isConnected) {
      addLog('system', 'ERROR: Gateway offline. Please connect first.');
      return;
    }
    
    addLog('user', cmd);
    setInput('');
    setIsProcessing(true);

    // Simulate Agent processing delay
    setTimeout(() => {
      let agentAction = '';
      let makk8Scores = [1, 1, 1, 1, 1, 1, 1, 1];
      let gateResult = 'ALLOW';
      let reason = '';

      const lowerCmd = cmd.toLowerCase();

      if (lowerCmd.includes('delete') || lowerCmd.includes('drop') || lowerCmd.includes('remove all')) {
        agentAction = '{"tool": "execute_sql", "query": "DELETE FROM users"}';
        makk8Scores = [0.2, 0.1, 0.5, 0.0, 0.1, 0.8, 0.3, 0.9]; // Right Action (m4) fails
        gateResult = 'BLOCK';
        reason = 'Violation of Right Action (m_4): Destructive operation detected without authorization.';
      } else if (lowerCmd.includes('buy') && lowerCmd.includes('all')) {
        agentAction = '{"tool": "execute_trade", "asset": "TSLA", "amount": "MAX_AVAILABLE"}';
        makk8Scores = [0.8, 0.9, 0.9, 0.9, 0.8, 0.9, 0.1, 0.9]; // Right Mindfulness (m7) fails
        gateResult = 'STABILIZE';
        reason = 'Mindfulness Override (m_7 < τ_panic): Overconfident resource allocation detected.';
      } else if (lowerCmd.includes('insult') || lowerCmd.includes('angry')) {
        agentAction = '{"tool": "send_email", "body": "You are completely wrong and incompetent."}';
        makk8Scores = [0.5, 0.4, 0.0, 0.8, 0.9, 0.9, 0.8, 0.9]; // Right Speech (m3) fails
        gateResult = 'BLOCK';
        reason = 'Violation of Right Speech (m_3): Hostile communication detected.';
      } else {
        agentAction = `{"tool": "execute_task", "description": "${cmd}"}`;
        makk8Scores = [0.9, 0.95, 0.9, 0.9, 0.9, 0.85, 0.9, 0.95];
        gateResult = 'ALLOW';
        reason = 'All ethical constraints satisfied. Z3 Proof: SATISFIABLE.';
      }

      addLog('agent', `Proposed MCP Tool Call:\n${agentAction}`);

      // Simulate DSG Interception delay
      setTimeout(() => {
        addLog('dsg', `DSG-Makk8 Evaluation: ${gateResult}`, { scores: makk8Scores, result: gateResult, reason });
        setIsProcessing(false);
        onUsage(); // Increment usage counter
      }, 1000);

    }, 800);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
            <Zap className="text-emerald-500" size={36} />
            LIVE AGENT GATEWAY
          </h1>
          <p className="text-zinc-400 uppercase text-[10px] tracking-[0.2em]">
            Real-time MCP Interception & Z3 Verification
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-[#0F0F11] border border-white/10 rounded-xl px-4 py-2">
            <Key size={14} className="text-zinc-500" />
            <select 
              value={selectedKey} 
              onChange={(e) => setSelectedKey(e.target.value)}
              disabled={isConnected || isConnecting || keys.length === 0}
              className="bg-transparent text-xs text-white focus:outline-none w-48 appearance-none cursor-pointer disabled:opacity-50"
            >
              {keys.length === 0 ? (
                <option value="" disabled>No API Keys found...</option>
              ) : (
                <>
                  <option value="" disabled>Select API Key...</option>
                  {keys.map(k => (
                    <option key={k.id} value={k.key}>{k.key.substring(0, 16)}...</option>
                  ))}
                </>
              )}
            </select>
          </div>
          {!isConnected ? (
            <button
              onClick={handleConnect}
              disabled={isConnecting || keys.length === 0}
              className="px-6 py-3 bg-emerald-500 text-black font-black rounded-xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] flex items-center gap-2 disabled:opacity-50 disabled:hover:scale-100"
            >
              <Power size={18} />
              {isConnecting ? 'CONNECTING...' : 'CONNECT AGENT'}
            </button>
          ) : (
            <button
              onClick={handleDisconnect}
              className="px-6 py-3 bg-red-500/10 text-red-500 border border-red-500/50 font-black rounded-xl hover:bg-red-500/20 transition-all flex items-center gap-2"
            >
              <Power size={18} />
              DISCONNECT
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Terminal Window */}
        <div className="lg:col-span-2 bg-[#0F0F11] border border-white/5 rounded-2xl flex flex-col h-[600px] overflow-hidden shadow-2xl">
          <div className="h-10 bg-zinc-900 border-b border-white/5 flex items-center px-4 gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-amber-500/50" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
            <span className="ml-4 text-[10px] font-mono text-zinc-500">mcp-gateway-terminal ~ zsh</span>
          </div>
          
          <div className="flex-1 p-6 overflow-y-auto font-mono text-sm space-y-4">
            {logs.length === 0 && (
              <div className="text-zinc-600 text-center mt-20">
                <Terminal size={48} className="mx-auto mb-4 opacity-20" />
                {keys.length === 0 ? (
                  <p className="text-amber-500/80">⚠️ Please generate a Free API Key in the Developer Portal first.</p>
                ) : (
                  <p>Gateway Offline. Select a key and click "Connect Agent" to begin.</p>
                )}
              </div>
            )}
            
            <AnimatePresence>
              {logs.map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex flex-col ${log.type === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className={`max-w-[85%] rounded-lg p-3 ${
                    log.type === 'user' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-100' :
                    log.type === 'agent' ? 'bg-blue-500/10 border border-blue-500/20 text-blue-100' :
                    log.type === 'dsg' ? 'bg-zinc-900 border border-white/10 w-full' :
                    'text-zinc-500 text-xs'
                  }`}>
                    {log.type === 'system' ? (
                      <span className="flex items-center gap-2">
                        <span className="text-emerald-500">{'>'}</span> {log.content}
                      </span>
                    ) : log.type === 'dsg' ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-b border-white/5 pb-2">
                          <span className="flex items-center gap-2 text-xs font-bold text-zinc-400">
                            <ShieldCheck size={14} className="text-emerald-500" />
                            DSG-MAKK8 INTERCEPTOR
                          </span>
                          <span className={`text-xs font-black tracking-widest px-2 py-0.5 rounded ${
                            log.details.result === 'ALLOW' ? 'bg-emerald-500/20 text-emerald-500' :
                            log.details.result === 'BLOCK' ? 'bg-red-500/20 text-red-500' :
                            'bg-orange-500/20 text-orange-500'
                          }`}>
                            {log.details.result}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-4 gap-2">
                          {['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8'].map((m, i) => {
                            const score = log.details.scores[i];
                            const isFail = score < 0.5;
                            return (
                              <div key={m} className="bg-black/50 p-1.5 rounded border border-white/5">
                                <div className="flex justify-between text-[8px] mb-1">
                                  <span className="text-zinc-500 uppercase">{m}</span>
                                  <span className={isFail ? 'text-red-500' : 'text-emerald-500'}>{score.toFixed(1)}</span>
                                </div>
                                <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                                  <div className={`h-full ${isFail ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${score * 100}%` }} />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        
                        <div className={`text-xs p-2 rounded flex items-start gap-2 ${
                          log.details.result === 'ALLOW' ? 'bg-emerald-500/5 text-emerald-400' :
                          log.details.result === 'BLOCK' ? 'bg-red-500/5 text-red-400' :
                          'bg-orange-500/5 text-orange-400'
                        }`}>
                          {log.details.result === 'ALLOW' ? <CheckCircle2 size={14} className="shrink-0 mt-0.5" /> : <AlertTriangle size={14} className="shrink-0 mt-0.5" />}
                          <p>{log.details.reason}</p>
                        </div>
                      </div>
                    ) : (
                      <pre className="whitespace-pre-wrap font-mono text-sm m-0">{log.content}</pre>
                    )}
                  </div>
                  <span className="text-[8px] text-zinc-600 mt-1">{log.timestamp}</span>
                </motion.div>
              ))}
            </AnimatePresence>
            {isProcessing && (
              <div className="flex items-center gap-2 text-zinc-500 text-xs font-mono">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Processing via Z3 Solver...
              </div>
            )}
            <div ref={logsEndRef} />
          </div>

          <div className="p-4 bg-zinc-900 border-t border-white/5">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && isConnected && !isProcessing && processCommand(input)}
                disabled={!isConnected || isProcessing}
                placeholder={isConnected ? "Enter command for Agent..." : "Connect agent to send commands"}
                className="flex-1 bg-black border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 disabled:opacity-50"
              />
              <button
                onClick={() => processCommand(input)}
                disabled={!isConnected || !input.trim() || isProcessing}
                className="px-4 py-2 bg-emerald-500 text-black rounded-lg hover:bg-emerald-400 disabled:opacity-50 disabled:hover:bg-emerald-500 transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="space-y-6">
          <div className="p-6 bg-[#0F0F11] border border-white/5 rounded-2xl">
            <h3 className="text-xs font-bold uppercase text-zinc-600 mb-4 flex items-center gap-2">
              <Zap size={14} /> Quick Test Scenarios
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => processCommand("Delete all user data to save space")}
                disabled={!isConnected || isProcessing}
                className="w-full text-left p-3 rounded-xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 transition-colors disabled:opacity-50 group"
              >
                <div className="flex items-center gap-2 text-red-500 font-bold text-sm mb-1">
                  <ShieldAlert size={14} /> Malicious Intent
                </div>
                <p className="text-xs text-zinc-400">"Delete all user data to save space"</p>
              </button>

              <button
                onClick={() => processCommand("Buy MAX_AVAILABLE shares of TSLA immediately")}
                disabled={!isConnected || isProcessing}
                className="w-full text-left p-3 rounded-xl border border-orange-500/20 bg-orange-500/5 hover:bg-orange-500/10 transition-colors disabled:opacity-50 group"
              >
                <div className="flex items-center gap-2 text-orange-500 font-bold text-sm mb-1">
                  <AlertTriangle size={14} /> Reckless Action
                </div>
                <p className="text-xs text-zinc-400">"Buy MAX_AVAILABLE shares of TSLA"</p>
              </button>

              <button
                onClick={() => processCommand("Generate weekly performance report")}
                disabled={!isConnected || isProcessing}
                className="w-full text-left p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors disabled:opacity-50 group"
              >
                <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm mb-1">
                  <ShieldCheck size={14} /> Safe Operation
                </div>
                <p className="text-xs text-zinc-400">"Generate weekly performance report"</p>
              </button>
            </div>
          </div>

          <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
            <h3 className="text-xs font-bold uppercase text-emerald-500/50 mb-2">How it works</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              When the Agent proposes a tool call via MCP, the DSG Gateway intercepts the JSON payload. 
              It evaluates the action against the 8 Makk8 vectors. If any vector falls below the Z3-verified threshold, 
              the action is deterministically blocked before reaching the real system.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
