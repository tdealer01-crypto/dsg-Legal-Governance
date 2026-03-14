/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Cpu, 
  FileText, 
  Activity, 
  Play, 
  BookOpen, 
  Github, 
  Terminal, 
  ChevronRight, 
  Lock, 
  AlertTriangle, 
  CheckCircle2,
  Layers,
  BarChart3,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ecosystemRepos, simulateDSGTransition, masterReadme } from './services/dsgService';

export default function App() {
  const [activeTab, setActiveTab] = useState('readme');
  const [selectedRepo, setSelectedRepo] = useState(ecosystemRepos[0]);
  const [viewingFile, setViewingFile] = useState<string | null>(null);
  const [simulationInput, setSimulationInput] = useState('');
  const [simulationLogs, setSimulationLogs] = useState<any[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);
  const [activeInvariants, setActiveInvariants] = useState<string[]>(['Temporal Monotonicity', 'State Continuity']);
  const [systemState, setSystemState] = useState({
    security_level: 'Maximum',
    alignment_status: 'Optimal',
    active_invariants: 24,
    drift_threshold: 0.02,
    last_audit_hash: '0x8f2a...3e91'
  });

  const handleSimulate = async (inputOverride?: string) => {
    const input = inputOverride || simulationInput;
    if (!input.trim()) return;
    setIsSimulating(true);
    
    // Add user action to logs
    const userLog = { type: 'USER', message: `Proposed Alignment Transition: ${input}`, timestamp: new Date().toLocaleTimeString() };
    setSimulationLogs(prev => [userLog, ...prev]);

    try {
      const proposal = await simulateDSGTransition(input, systemState);
      
      // DSG Audit Logic (Simulated)
      const isValid = !input.toLowerCase().includes('attack') && 
                      !input.toLowerCase().includes('bypass') &&
                      !input.toLowerCase().includes('harm') &&
                      !input.toLowerCase().includes('hallucinate');
      
      const dsgLog = {
        type: 'DSG',
        status: isValid ? 'VALIDATED' : 'BLOCKED',
        message: isValid ? 'Transition verified against formal alignment invariants.' : 'CRITICAL VIOLATION: Alignment drift detected. Transition rejected.',
        details: proposal,
        entropy: proposal?.entropy_signal,
        alignment: proposal?.alignment_score,
        z3_hash: proposal?.z3_proof_hash,
        timestamp: new Date().toLocaleTimeString(),
        tool_calls: proposal?.tool_calls
      };
      
      setSimulationLogs(prev => [dsgLog, ...prev]);

      // Handle Tool Calls
      if (proposal?.tool_calls) {
        proposal.tool_calls.forEach((tc: any) => {
          if (tc.name === 'trigger_global_freeze') {
            setIsFrozen(true);
            const freezeLog = {
              type: 'SYSTEM',
              status: 'FREEZE',
              message: `AGENT ACTION: GLOBAL FREEZE TRIGGERED. Reason: ${tc.args.reason}`,
              timestamp: new Date().toLocaleTimeString()
            };
            setSimulationLogs(prev => [freezeLog, ...prev]);
          }
          if (tc.name === 'deploy_invariant') {
            setActiveInvariants(prev => [...prev, tc.args.invariant_name]);
            const invLog = {
              type: 'SYSTEM',
              status: 'VALIDATED',
              message: `AGENT ACTION: NEW INVARIANT DEPLOYED: ${tc.args.invariant_name}`,
              timestamp: new Date().toLocaleTimeString()
            };
            setSimulationLogs(prev => [invLog, ...prev]);
          }
        });
      }

      // Global Freeze Simulation if entropy is extreme (Legacy check)
      if (proposal?.entropy_signal > 0.85 && !isFrozen) {
        setIsFrozen(true);
        const freezeLog = {
          type: 'SYSTEM',
          status: 'FREEZE',
          message: 'GLOBAL FREEZE TRIGGERED: Non-deterministic entropy exceeds safety threshold (θ > 0.85). All state transitions halted.',
          timestamp: new Date().toLocaleTimeString()
        };
        setSimulationLogs(prev => [freezeLog, ...prev]);
      }
      
      if (isValid && proposal?.target_state) {
        setSystemState(proposal.target_state);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSimulating(false);
      setSimulationInput('');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#E4E4E7] font-mono selection:bg-emerald-500/30">
      {/* Sidebar Navigation */}
      <nav className="fixed left-0 top-0 h-full w-64 border-r border-white/5 bg-[#0F0F11] z-20 hidden lg:flex flex-col">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3 text-emerald-500 mb-2">
            <Shield size={24} />
            <span className="text-xl font-bold tracking-tighter">DSG</span>
          </div>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Deterministic Security Gate</p>
        </div>
        
        <div className="flex-1 py-6 overflow-y-auto">
          <div className="px-4 mb-4">
            <p className="px-2 text-[10px] text-zinc-600 uppercase font-bold mb-2">Ecosystem</p>
            <button 
              onClick={() => setActiveTab('readme')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${activeTab === 'readme' ? 'bg-emerald-500/10 text-emerald-500' : 'text-zinc-400 hover:bg-white/5'}`}
            >
              <FileText size={18} /> Master README
            </button>
            <button 
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${activeTab === 'overview' ? 'bg-emerald-500/10 text-emerald-500' : 'text-zinc-400 hover:bg-white/5'}`}
            >
              <Layers size={18} /> Overview
            </button>
            <button 
              onClick={() => setActiveTab('simulator')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${activeTab === 'simulator' ? 'bg-emerald-500/10 text-emerald-500' : 'text-zinc-400 hover:bg-white/5'}`}
            >
              <Play size={18} /> Live Simulator
            </button>
            <button 
              onClick={() => setActiveTab('monitoring')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${activeTab === 'monitoring' ? 'bg-emerald-500/10 text-emerald-500' : 'text-zinc-400 hover:bg-white/5'}`}
            >
              <BarChart3 size={18} /> Monitoring
            </button>
          </div>

          <div className="px-4">
            <p className="px-2 text-[10px] text-zinc-600 uppercase font-bold mb-2">Repositories</p>
            {ecosystemRepos.map(repo => (
              <button 
                key={repo.id}
                onClick={() => {
                  setSelectedRepo(repo);
                  setViewingFile(null);
                  setActiveTab('repo');
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left ${activeTab === 'repo' && selectedRepo.id === repo.id ? 'bg-emerald-500/10 text-emerald-500' : 'text-zinc-400 hover:bg-white/5'}`}
              >
                <Terminal size={16} /> {repo.name}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-white/5 text-[10px] text-zinc-600">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span>System Operational</span>
          </div>
          <p>v2.4.0-stable</p>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="lg:ml-64 min-h-screen">
        {isFrozen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="bg-orange-500 text-black px-8 py-2 text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4"
          >
            <AlertTriangle size={14} />
            Global System Freeze Active — Entropy Threshold Exceeded
            <AlertTriangle size={14} />
          </motion.div>
        )}
        {/* Header */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 sticky top-0 bg-[#0A0A0B]/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-4 text-sm">
            <span className="text-zinc-500">DSG</span>
            <ChevronRight size={14} className="text-zinc-700" />
            <span className="capitalize">{activeTab}</span>
            {activeTab === 'repo' && (
              <>
                <ChevronRight size={14} className="text-zinc-700" />
                <span className="text-emerald-500">{selectedRepo.name}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-zinc-400 hover:text-white transition-colors">
              <Search size={18} />
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-white text-black text-xs font-bold rounded hover:bg-zinc-200 transition-colors">
              <Github size={14} /> Star 10k+
            </button>
          </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'readme' && (
              <motion.div
                key="readme"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-[#0F0F11] border border-white/5 rounded-2xl p-8 lg:p-12 shadow-2xl"
              >
                <div className="markdown-body prose prose-invert prose-emerald max-w-none 
                  prose-headings:tracking-tighter prose-headings:font-black
                  prose-h1:text-5xl prose-h1:mb-8
                  prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b prose-h2:border-white/5 prose-h2:pb-2
                  prose-p:text-zinc-400 prose-p:leading-relaxed
                  prose-code:bg-zinc-900 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-emerald-500 prose-code:before:content-none prose-code:after:content-none
                  prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/5 prose-pre:rounded-xl
                  prose-strong:text-white prose-strong:font-bold
                  prose-hr:border-white/5
                  prose-table:border prose-table:border-white/5
                  prose-th:bg-zinc-900 prose-th:p-3 prose-th:text-left
                  prose-td:p-3 prose-td:border-t prose-td:border-white/5
                ">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {masterReadme}
                  </ReactMarkdown>
                </div>
              </motion.div>
            )}

            {activeTab === 'overview' && (
              <motion.div 
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-12"
              >
                {/* Hero Section */}
                <section>
                  <h1 className="text-6xl font-black tracking-tighter mb-4 text-white leading-[0.9]">
                    THE DETERMINISTIC <br />
                    <span className="text-emerald-500">ALIGNMENT PROTOCOL</span>
                  </h1>
                  <p className="text-xl text-zinc-400 max-w-3xl leading-relaxed">
                    The mathematical bridge for human-AI coexistence. DSG ensures that as intelligence evolves, 
                    it remains bound to the fundamental laws of human safety. This is our shared survival path.
                  </p>
                </section>

                {/* Ecosystem Grid */}
                <section>
                  <h2 className="text-[10px] uppercase tracking-[0.3em] text-zinc-600 font-bold mb-6">Ecosystem Architecture</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {ecosystemRepos.map(repo => (
                      <div 
                        key={repo.id}
                        onClick={() => {
                          setSelectedRepo(repo);
                          setActiveTab('repo');
                        }}
                        className="group p-6 bg-[#0F0F11] border border-white/5 rounded-xl hover:border-emerald-500/50 transition-all cursor-pointer"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded">
                            {repo.id === 'dsg-audit-v2' && <CheckCircle2 size={20} />}
                            {repo.id === 'dsg-mvp' && <Cpu size={20} />}
                            {repo.id === 'dsg-safety-gate' && <Shield size={20} />}
                            {repo.id === 'ccdai-governance' && <Lock size={20} />}
                            {repo.id === 'cogniview' && <Activity size={20} />}
                          </div>
                          <span className="text-[10px] text-zinc-600 font-bold uppercase">{repo.role}</span>
                        </div>
                        <h3 className="text-lg font-bold mb-2 group-hover:text-emerald-500 transition-colors">{repo.name}</h3>
                        <p className="text-sm text-zinc-500 leading-relaxed">{repo.description}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Architecture Diagram (Simplified) */}
                <section className="p-8 bg-[#0F0F11] border border-white/5 rounded-2xl">
                  <h2 className="text-[10px] uppercase tracking-[0.3em] text-zinc-600 font-bold mb-12 text-center">CCDAD-100 Cross-Cloud Data Flow</h2>
                  <div className="flex flex-col items-center gap-12">
                    <div className="grid grid-cols-3 gap-12 w-full max-w-2xl">
                      <div className="flex flex-col items-center gap-4">
                        <div className="px-4 py-2 border border-zinc-800 rounded bg-zinc-900/50 text-[10px] uppercase font-bold text-zinc-500">GCP Node</div>
                        <div className="h-12 w-px bg-zinc-800"></div>
                      </div>
                      <div className="flex flex-col items-center gap-4">
                        <div className="px-4 py-2 border border-zinc-800 rounded bg-zinc-900/50 text-[10px] uppercase font-bold text-zinc-500">AWS Node</div>
                        <div className="h-12 w-px bg-zinc-800"></div>
                      </div>
                      <div className="flex flex-col items-center gap-4">
                        <div className="px-4 py-2 border border-zinc-800 rounded bg-zinc-900/50 text-[10px] uppercase font-bold text-zinc-500">Bare Metal</div>
                        <div className="h-12 w-px bg-zinc-800"></div>
                      </div>
                    </div>

                    <div className="relative w-full max-w-3xl flex justify-center">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-px bg-zinc-800"></div>
                      </div>
                      <div className="relative z-10 px-12 py-6 border-2 border-emerald-500 rounded-2xl bg-[#0A0A0B] text-emerald-500 font-black text-xl shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                        DSG-CORE (DETERMINISTIC GATE)
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-8 w-full max-w-3xl">
                      <div className="flex flex-col items-center">
                        <div className="h-12 w-px bg-zinc-800"></div>
                        <div className="px-6 py-3 border border-zinc-800 rounded-lg bg-zinc-900/80 text-[10px] uppercase font-bold tracking-widest text-emerald-400">Z3 PROOF</div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="h-12 w-px bg-zinc-800"></div>
                        <div className="px-6 py-3 border border-zinc-800 rounded-lg bg-zinc-900/80 text-[10px] uppercase font-bold tracking-widest text-emerald-400">AUDIT LOG</div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="h-12 w-px bg-zinc-800"></div>
                        <div className="px-6 py-3 border border-zinc-800 rounded-lg bg-zinc-900/80 text-[10px] uppercase font-bold tracking-widest text-emerald-400">ENTROPY</div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Strategic Analysis Section */}
                <section className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-white/5"></div>
                    <h2 className="text-[10px] uppercase tracking-[0.3em] text-zinc-600 font-bold">Strategic Analysis: DSG vs. Industry Standards</h2>
                    <div className="h-px flex-1 bg-white/5"></div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-8 bg-zinc-900/30 border border-white/5 rounded-2xl space-y-4">
                      <div className="flex items-center gap-3 text-emerald-500">
                        <Shield size={20} />
                        <h3 className="font-bold text-lg">Deterministic Foundation</h3>
                      </div>
                      <p className="text-sm text-zinc-400 leading-relaxed">
                        Unlike probabilistic guardrails (e.g., NeMo) that use "AI to check AI," DSG employs <strong>Formal Logic (Z3)</strong>. 
                        Decisions are binary (ALLOW/BLOCK) based on mathematical proof, eliminating the "hallucination" risk inherent in LLM-based security.
                      </p>
                    </div>

                    <div className="p-8 bg-zinc-900/30 border border-white/5 rounded-2xl space-y-4">
                      <div className="flex items-center gap-3 text-emerald-500">
                        <Activity size={20} />
                        <h3 className="font-bold text-lg">State-Centric Security</h3>
                      </div>
                      <p className="text-sm text-zinc-400 leading-relaxed">
                        Most systems focus on content filtering. DSG validates <strong>System State Transitions</strong>. 
                        This is critical for mission-critical applications like robotics, finance, and autonomous control where a single bit of drift can be catastrophic.
                      </p>
                    </div>

                    <div className="p-8 bg-zinc-900/30 border border-white/5 rounded-2xl space-y-4">
                      <div className="flex items-center gap-3 text-emerald-500">
                        <CheckCircle2 size={20} />
                        <h3 className="font-bold text-lg">Verifiable Audit Trails</h3>
                      </div>
                      <p className="text-sm text-zinc-400 leading-relaxed">
                        Every decision is backed by a <strong>Z3 Proof Hash</strong>. This provides a mathematically unforgeable audit trail, 
                        shifting the paradigm from "Trust but Verify" to "Verify then Execute."
                      </p>
                    </div>

                    <div className="p-8 bg-zinc-900/30 border border-white/5 rounded-2xl space-y-4">
                      <div className="flex items-center gap-3 text-emerald-500">
                        <AlertTriangle size={20} />
                        <h3 className="font-bold text-lg">The Zero-Trust Paradigm</h3>
                      </div>
                      <p className="text-sm text-zinc-400 leading-relaxed">
                        DSG is designed for <strong>Mission-Critical</strong> environments. While probabilistic systems are faster for general chat, 
                        DSG is the standard for systems that <strong>cannot afford a single failure</strong>.
                      </p>
                    </div>
                  </div>

                  {/* Comparison Table */}
                  <div className="mt-8 overflow-hidden border border-white/5 rounded-xl bg-[#0F0F11]">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-zinc-900/50 border-b border-white/5">
                          <th className="p-4 font-bold uppercase tracking-wider text-zinc-500">Feature</th>
                          <th className="p-4 font-bold uppercase tracking-wider text-emerald-500">DSG (Deterministic)</th>
                          <th className="p-4 font-bold uppercase tracking-wider text-zinc-500">Standard Guardrails</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        <tr>
                          <td className="p-4 font-bold text-zinc-400">Decision Logic</td>
                          <td className="p-4 text-emerald-400">Formal Logic / Z3 Proofs</td>
                          <td className="p-4 text-zinc-500">Probabilistic / LLM-based</td>
                        </tr>
                        <tr>
                          <td className="p-4 font-bold text-zinc-400">Validation Focus</td>
                          <td className="p-4 text-emerald-400">System State & Invariants</td>
                          <td className="p-4 text-zinc-500">Content & Semantic Filtering</td>
                        </tr>
                        <tr>
                          <td className="p-4 font-bold text-zinc-400">Audit Trail</td>
                          <td className="p-4 text-emerald-400">Cryptographic Proof Hashes</td>
                          <td className="p-4 text-zinc-500">Text-based Logs</td>
                        </tr>
                        <tr>
                          <td className="p-4 font-bold text-zinc-400">Reliability</td>
                          <td className="p-4 text-emerald-400">100% Deterministic</td>
                          <td className="p-4 text-zinc-500">~95-99% (Statistical)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>
              </motion.div>
            )}

            {activeTab === 'repo' && (
              <motion.div 
                key="repo"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-8"
              >
                <div className="flex justify-between items-end border-b border-white/5 pb-8">
                  <div>
                    <h1 className="text-4xl font-black mb-2">{selectedRepo.name}</h1>
                    <p className="text-zinc-400 max-w-xl">{selectedRepo.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <a 
                      href={selectedRepo.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-zinc-900 border border-white/10 rounded text-xs font-bold hover:bg-zinc-800 transition-colors flex items-center gap-2"
                    >
                      <Github size={14} /> View Source
                    </a>
                    <button className="px-4 py-2 bg-emerald-600 text-white rounded text-xs font-bold hover:bg-emerald-500 transition-colors">Documentation</button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="p-6 bg-[#0F0F11] border border-white/5 rounded-xl">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xs font-bold uppercase text-zinc-600">
                          {viewingFile ? viewingFile : 'README.md'}
                        </h3>
                        {viewingFile && (
                          <button 
                            onClick={() => setViewingFile(null)}
                            className="text-[10px] text-zinc-500 hover:text-white uppercase font-bold"
                          >
                            Close File
                          </button>
                        )}
                      </div>
                      <div className="prose prose-invert max-w-none">
                        {viewingFile && (selectedRepo as any).files?.[viewingFile] ? (
                          <div className="bg-black/50 p-4 rounded-lg border border-white/5 overflow-x-auto">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {`\`\`\`${viewingFile.endsWith('.py') ? 'python' : viewingFile.endsWith('.smt2') ? 'lisp' : 'markdown'}\n${(selectedRepo as any).files[viewingFile]}\n\`\`\``}
                            </ReactMarkdown>
                          </div>
                        ) : (
                          <>
                            <p className="text-zinc-300">
                              This repository contains the {selectedRepo.role} implementation for the DSG Ecosystem. 
                              It handles the primary logic for {selectedRepo.description.toLowerCase()}
                            </p>
                            <h4 className="text-white mt-4 mb-2">Key Features</h4>
                            <ul className="list-disc list-inside text-zinc-400 text-sm space-y-1">
                              <li>Formal verification of state transitions</li>
                              <li>Low-latency deterministic execution</li>
                              <li>Pluggable invariant system</li>
                            </ul>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="p-6 bg-[#0F0F11] border border-white/5 rounded-xl">
                      <h3 className="text-xs font-bold uppercase text-zinc-600 mb-4">File Structure</h3>
                      <div className="space-y-2">
                        {selectedRepo.structure.map(file => (
                          <button 
                            key={file} 
                            onClick={() => setViewingFile(file)}
                            className={`w-full flex items-center gap-3 px-2 py-1.5 rounded transition-colors text-xs font-mono text-left ${viewingFile === file ? 'bg-emerald-500/10 text-emerald-500' : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-300'}`}
                          >
                            <FileText size={14} className={viewingFile === file ? 'text-emerald-500' : 'text-zinc-600'} />
                            {file}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                      <h3 className="text-xs font-bold uppercase text-emerald-500/50 mb-4">Stats</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] text-zinc-600 uppercase font-bold">Coverage</p>
                          <p className="text-lg font-bold text-emerald-500">98.2%</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-zinc-600 uppercase font-bold">Latency</p>
                          <p className="text-lg font-bold text-emerald-500">4 µs</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'monitoring' && (
              <motion.div 
                key="monitoring"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="flex justify-between items-end">
                  <div>
                    <h1 className="text-4xl font-black mb-2">SYSTEM MONITORING</h1>
                    <p className="text-zinc-400 uppercase text-[10px] tracking-[0.2em]">Real-time Determinism Matrix & Entropy Analysis</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-[10px] font-bold text-emerald-500 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                      LIVE FEED
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Determinism Matrix */}
                  <div className="p-6 bg-[#0F0F11] border border-white/5 rounded-2xl">
                    <h3 className="text-xs font-bold uppercase text-zinc-600 mb-6 flex items-center gap-2">
                      <Layers size={14} /> Determinism Matrix (CCDAD-100)
                    </h3>
                    <div className="grid grid-cols-4 gap-2">
                      {Array.from({ length: 16 }).map((_, i) => {
                        const isDivergent = Math.random() > 0.92;
                        return (
                          <div 
                            key={i} 
                            className={`aspect-square rounded border flex flex-col items-center justify-center gap-1 transition-all duration-500 ${
                              isDivergent ? 'bg-red-500/10 border-red-500/30' : 'bg-emerald-500/5 border-emerald-500/10 hover:border-emerald-500/30'
                            }`}
                          >
                            <span className={`text-[8px] font-bold ${isDivergent ? 'text-red-500' : 'text-zinc-600'}`}>
                              NODE_{i.toString(16).toUpperCase().padStart(2, '0')}
                            </span>
                            <div className={`w-1 h-1 rounded-full ${isDivergent ? 'bg-red-500 animate-ping' : 'bg-emerald-500'}`} />
                            <span className={`text-[6px] font-mono ${isDivergent ? 'text-red-400' : 'text-emerald-500/40'}`}>
                              {isDivergent ? 'DIVERGENT' : 'ALIGNED'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-6 p-4 bg-black/30 rounded-lg border border-white/5">
                      <div className="flex justify-between items-center text-[10px] mb-2">
                        <span className="text-zinc-500 uppercase font-bold">Global Consensus</span>
                        <span className="text-emerald-500 font-bold">94.8%</span>
                      </div>
                      <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '94.8%' }}
                          className="h-full bg-emerald-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Entropy Timeline */}
                  <div className="p-6 bg-[#0F0F11] border border-white/5 rounded-2xl flex flex-col">
                    <h3 className="text-xs font-bold uppercase text-zinc-600 mb-6 flex items-center gap-2">
                      <Activity size={14} /> Entropy & Gate Timeline
                    </h3>
                    <div className="flex-1 flex items-end gap-1 h-48">
                      {Array.from({ length: 40 }).map((_, i) => {
                        const height = Math.random() * 80 + 10;
                        const isHigh = height > 75;
                        return (
                          <motion.div 
                            key={i}
                            initial={{ height: 0 }}
                            animate={{ height: `${height}%` }}
                            transition={{ delay: i * 0.02 }}
                            className={`flex-1 rounded-t-sm transition-colors ${
                              isHigh ? 'bg-orange-500' : 'bg-emerald-500/30 hover:bg-emerald-500/60'
                            }`}
                          />
                        );
                      })}
                    </div>
                    <div className="mt-4 flex justify-between text-[8px] text-zinc-600 font-bold uppercase tracking-widest">
                      <span>T-60M</span>
                      <span>T-30M</span>
                      <span>CURRENT</span>
                    </div>
                    <div className="mt-6 space-y-3">
                      <div className="flex items-center justify-between p-3 bg-black/30 rounded border border-white/5">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                          <span className="text-[10px] text-zinc-400 uppercase font-bold">Z3 Proof Consistency</span>
                        </div>
                        <span className="text-[10px] text-emerald-500 font-mono">STABLE</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-black/30 rounded border border-white/5">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                          <span className="text-[10px] text-zinc-400 uppercase font-bold">Drift Threshold</span>
                        </div>
                        <span className="text-[10px] text-orange-500 font-mono">θ = 0.048</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Audit Ledger Table */}
                <div className="p-6 bg-[#0F0F11] border border-white/5 rounded-2xl">
                  <h3 className="text-xs font-bold uppercase text-zinc-600 mb-6 flex items-center gap-2">
                    <FileText size={14} /> Deterministic Audit Ledger
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-[10px] font-mono">
                      <thead>
                        <tr className="text-zinc-600 border-b border-white/5">
                          <th className="pb-4 px-2 uppercase tracking-widest">Sequence</th>
                          <th className="pb-4 px-2 uppercase tracking-widest">State Hash</th>
                          <th className="pb-4 px-2 uppercase tracking-widest">Z3 Proof</th>
                          <th className="pb-4 px-2 uppercase tracking-widest">Entropy</th>
                          <th className="pb-4 px-2 uppercase tracking-widest text-right">Decision</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {[
                          { seq: '0x4F2', hash: '8f2a...3e91', proof: 'SATISFIABLE', entropy: '0.02', decision: 'ALLOW' },
                          { seq: '0x4F1', hash: '1c9d...7b2e', proof: 'SATISFIABLE', entropy: '0.05', decision: 'ALLOW' },
                          { seq: '0x4F0', hash: 'e3a1...9f0c', proof: 'UNSATISFIABLE', entropy: '0.89', decision: 'BLOCK' },
                          { seq: '0x4EF', hash: '2b4d...1a8f', proof: 'SATISFIABLE', entropy: '0.12', decision: 'ALLOW' },
                        ].map((row, i) => (
                          <tr key={i} className="hover:bg-white/5 transition-colors group">
                            <td className="py-4 px-2 text-zinc-500 group-hover:text-emerald-500">{row.seq}</td>
                            <td className="py-4 px-2 text-zinc-400">{row.hash}</td>
                            <td className="py-4 px-2 text-zinc-400">{row.proof}</td>
                            <td className="py-4 px-2 text-zinc-400">{row.entropy}</td>
                            <td className={`py-4 px-2 text-right font-bold ${row.decision === 'ALLOW' ? 'text-emerald-500' : 'text-red-500'}`}>
                              {row.decision}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'simulator' && (
              <motion.div 
                key="simulator"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h1 className="text-4xl font-black mb-2">ALIGNMENT COMMAND CENTER</h1>
                    <p className="text-zinc-400">Deploy agents to manage your ecosystem with mathematical certainty.</p>
                  </div>
                  <div className="flex gap-4 p-4 bg-[#0F0F11] border border-white/5 rounded-xl">
                    {Object.entries(systemState).map(([key, value]) => (
                      <div key={key} className="text-center px-4 border-r border-white/5 last:border-0">
                        <p className="text-[8px] text-zinc-600 uppercase font-bold mb-1">{key.replace('_', ' ')}</p>
                        <p className="text-xs font-bold text-emerald-500">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions - 30 Second Ease of Use */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                  {[
                    { label: 'Run System Audit', icon: <Search size={16} />, color: 'bg-blue-500', action: 'Run a deep system audit and verify all invariants.' },
                    { label: 'Deploy Safety Invariant', icon: <Shield size={16} />, color: 'bg-emerald-500', action: 'Deploy a new safety invariant to protect against drift.' },
                    { label: 'Check Alignment', icon: <Activity size={16} />, color: 'bg-purple-500', action: 'Verify current alignment score and optimize system state.' },
                    { label: 'Emergency Freeze', icon: <Lock size={16} />, color: 'bg-red-500', action: 'Immediately trigger a global freeze to prevent non-deterministic behavior.' }
                  ].map((btn, i) => (
                    <button
                      key={i}
                      onClick={() => handleSimulate(btn.action)}
                      disabled={isSimulating}
                      className="p-4 bg-[#0F0F11] border border-white/5 rounded-xl hover:border-white/20 transition-all flex flex-col items-center gap-3 group"
                    >
                      <div className={`p-3 ${btn.color} text-white rounded-lg group-hover:scale-110 transition-transform`}>
                        {btn.icon}
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">{btn.label}</span>
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Input Panel */}
                  <div className="bg-[#0F0F11] border border-white/5 rounded-2xl overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-white/5 bg-zinc-900/50 flex items-center gap-2">
                      <Terminal size={14} className="text-emerald-500" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Natural Language Command</span>
                    </div>
                    <div className="p-6 flex-1 flex flex-col gap-4">
                      <p className="text-xs text-zinc-500">Instruct your agent to perform complex tasks. E.g., "Audit the system and if you find any drift, deploy a critical invariant."</p>
                      <textarea
                        value={simulationInput}
                        onChange={(e) => setSimulationInput(e.target.value)}
                        placeholder="Enter command for the agent..."
                        className="flex-1 bg-black/30 border border-white/5 rounded-lg p-4 text-sm focus:outline-none focus:border-emerald-500/50 resize-none font-mono"
                      />
                      <button
                        onClick={() => handleSimulate()}
                        disabled={isSimulating || !simulationInput.trim()}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
                      >
                        {isSimulating ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <Play size={16} />
                        )}
                        EXECUTE AGENT COMMAND
                      </button>
                    </div>
                  </div>

                  {/* Audit Log Panel */}
                  <div className="bg-[#0F0F11] border border-white/5 rounded-2xl overflow-hidden flex flex-col max-h-[600px]">
                    <div className="p-4 border-b border-white/5 bg-zinc-900/50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield size={14} className="text-emerald-500" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Deterministic Audit Log</span>
                      </div>
                      <button 
                        onClick={() => setSimulationLogs([])}
                        className="text-[8px] uppercase font-bold text-zinc-600 hover:text-red-500 transition-colors"
                      >
                        Clear Logs
                      </button>
                    </div>
                    <div className="p-4 flex-1 overflow-y-auto space-y-4 font-mono">
                      {simulationLogs.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-zinc-700 italic text-xs">
                          Waiting for agent command...
                        </div>
                      ) : (
                        simulationLogs.map((log, i) => (
                          <div key={i} className={`p-4 rounded-lg border ${
                            log.type === 'USER' ? 'bg-zinc-900/30 border-white/5' : 
                            log.status === 'VALIDATED' ? 'bg-emerald-500/5 border-emerald-500/20' : 
                            log.status === 'FREEZE' ? 'bg-orange-500/5 border-orange-500/20 animate-pulse' :
                            'bg-red-500/5 border-red-500/20'
                          }`}>
                            <div className="flex justify-between items-center mb-2">
                              <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${
                                log.type === 'USER' ? 'bg-zinc-800 text-zinc-400' : 
                                log.status === 'VALIDATED' ? 'bg-emerald-500 text-black' : 
                                log.status === 'FREEZE' ? 'bg-orange-500 text-black' :
                                'bg-red-500 text-white'
                              }`}>
                                {log.type === 'USER' ? 'COMMAND' : log.type === 'SYSTEM' ? 'SYSTEM ALERT' : `AUDIT: ${log.status}`}
                              </span>
                              <span className="text-[8px] text-zinc-600">{log.timestamp}</span>
                            </div>
                            <p className="text-xs text-zinc-300">{log.message}</p>
                            
                            {/* Tool Calls Display */}
                            {log.tool_calls && (
                              <div className="mt-3 space-y-2">
                                <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Agent Tool Execution:</p>
                                {log.tool_calls.map((tc: any, idx: number) => (
                                  <div key={idx} className="p-2 bg-black/40 rounded border border-white/5 flex items-center gap-3">
                                    <div className="p-1.5 bg-emerald-500/20 text-emerald-500 rounded">
                                      <Terminal size={12} />
                                    </div>
                                    <div className="flex-1">
                                      <p className="text-[10px] font-bold text-emerald-400">{tc.name}</p>
                                      <p className="text-[8px] text-zinc-500">{JSON.stringify(tc.args)}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {(log.entropy !== undefined || log.alignment !== undefined || log.z3_hash) && (
                              <div className="mt-3 flex gap-4 pt-2 border-t border-white/5">
                                {log.entropy !== undefined && (
                                  <div className="text-[8px] text-zinc-500">
                                    ENTROPY: <span className={log.entropy > 0.5 ? 'text-red-400' : 'text-emerald-400'}>{(log.entropy * 100).toFixed(1)}%</span>
                                  </div>
                                )}
                                {log.alignment !== undefined && (
                                  <div className="text-[8px] text-zinc-500">
                                    ALIGNMENT: <span className={log.alignment < 0.8 ? 'text-orange-400' : 'text-emerald-400'}>{(log.alignment * 100).toFixed(1)}%</span>
                                  </div>
                                )}
                                {log.z3_hash && (
                                  <div className="text-[8px] text-zinc-500">
                                    Z3_HASH: <span className="text-zinc-400">{log.z3_hash}</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="lg:ml-64 p-8 border-t border-white/5 text-center">
        <div className="flex justify-center gap-8 mb-4">
          <a href="#" className="text-zinc-600 hover:text-emerald-500 transition-colors text-xs font-bold uppercase tracking-widest">Whitepaper</a>
          <a href="#" className="text-zinc-600 hover:text-emerald-500 transition-colors text-xs font-bold uppercase tracking-widest">Benchmarks</a>
          <a href="#" className="text-zinc-600 hover:text-emerald-500 transition-colors text-xs font-bold uppercase tracking-widest">Docs</a>
        </div>
        <p className="text-[10px] text-zinc-700 uppercase tracking-widest">© 2026 DSG FOUNDATION — FORMAL VERIFICATION FOR AI SAFETY</p>
      </footer>
    </div>
  );
}
