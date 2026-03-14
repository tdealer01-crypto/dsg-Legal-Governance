/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  ShieldCheck,
  Cpu, 
  FileText, 
  Activity, 
  Play, 
  BookOpen, 
  Github, 
  Terminal, 
  ChevronRight, 
  Lock, 
  Zap,
  AlertTriangle, 
  CheckCircle2,
  Layers,
  BarChart3,
  Search,
  RefreshCw,
  ExternalLink,
  Layout,
  Code2,
  GitBranch,
  Star,
  ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ecosystemRepos, simulateDSGTransition, masterReadme, launchStrategy, formalSpec } from './services/dsgService';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedRepo, setSelectedRepo] = useState(ecosystemRepos[0]);
  const [viewingFile, setViewingFile] = useState<string | null>(null);
  const [simulationInput, setSimulationInput] = useState('');
  const [simulationLogs, setSimulationLogs] = useState<any[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);
  const [starCount, setStarCount] = useState(9842);
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
    <div className="min-h-screen bg-[#0A0A0B] text-[#E4E4E7] font-mono selection:bg-emerald-500/30 pt-8">
      {/* Global Status Bar */}
      <div className="fixed top-0 left-0 right-0 h-8 bg-emerald-500 text-black z-[100] flex items-center justify-between px-4 overflow-hidden">
        <div className="flex items-center gap-12 whitespace-nowrap animate-marquee-fast">
          <div className="flex items-center gap-2">
            <ShieldCheck size={12} />
            <span className="text-[10px] font-black uppercase tracking-tighter">DSG MAINNET ACTIVE</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity size={12} />
            <span className="text-[10px] font-black uppercase tracking-tighter">NETWORK ENTROPY: 0.012 (OPTIMAL)</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock size={12} />
            <span className="text-[10px] font-black uppercase tracking-tighter">INVARIANTS VERIFIED: 1,402,931</span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu size={12} />
            <span className="text-[10px] font-black uppercase tracking-tighter">Z3 PROOF VELOCITY: 4.2ms/OP</span>
          </div>
          {/* Duplicate for seamless loop */}
          <div className="flex items-center gap-2">
            <ShieldCheck size={12} />
            <span className="text-[10px] font-black uppercase tracking-tighter">DSG MAINNET ACTIVE</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity size={12} />
            <span className="text-[10px] font-black uppercase tracking-tighter">NETWORK ENTROPY: 0.012 (OPTIMAL)</span>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-black text-emerald-500 px-2 py-0.5 rounded text-[8px] font-black shrink-0 z-10">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          LIVE ATTESTATION
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-[#0A0A0B] border-r border-white/5 z-50 hidden lg:flex flex-col">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-12 group cursor-pointer">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)] group-hover:scale-110 transition-transform">
              <Shield className="text-black" size={24} />
            </div>
            <div>
              <h2 className="font-black text-xl tracking-tighter leading-none text-white">DSG</h2>
              <p className="text-[8px] text-emerald-500 font-bold tracking-[0.2em] uppercase">Protocol v2.4</p>
            </div>
          </div>

          <nav className="space-y-1">
            {[
              { id: 'overview', label: 'Protocol Overview', icon: <Activity size={18} /> },
              { id: 'simulator', label: 'Command Center', icon: <Terminal size={18} /> },
              { id: 'monitoring', label: 'Live Attestation', icon: <Layers size={18} /> },
              { id: 'specification', label: 'Formal Spec', icon: <Code2 size={18} /> },
              { id: 'readme', label: 'Whitepaper', icon: <BookOpen size={18} /> },
              { id: 'strategy', label: 'Launch Strategy', icon: <Zap size={18} /> },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-bold ${
                  activeTab === item.id 
                    ? 'bg-emerald-500/10 text-emerald-500 shadow-[inset_0_0_20px_rgba(16,185,129,0.05)]' 
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-8 space-y-4">
          <div className="p-4 bg-zinc-900/50 border border-white/5 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-zinc-500 uppercase">GitHub Status</span>
              <div className="flex items-center gap-1 text-emerald-500">
                <Star className="w-2.5 h-2.5" fill="currentColor" />
                <span className="text-[10px] font-bold">{(starCount / 1000).toFixed(1)}k</span>
              </div>
            </div>
            <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 w-[98%]" />
            </div>
          </div>
          <button className="w-full py-3 bg-white text-black font-black text-xs rounded-xl hover:bg-emerald-500 transition-colors flex items-center justify-center gap-2">
            <Github size={14} /> STAR ON GITHUB
          </button>
        </div>
      </aside>

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
            {(activeTab === 'readme' || activeTab === 'strategy' || activeTab === 'specification') && (
              <motion.div
                key={activeTab}
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
                    {activeTab === 'readme' ? masterReadme : activeTab === 'strategy' ? launchStrategy : formalSpec}
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
                className="space-y-16"
              >
                {/* Hero Section - World Class Vibe */}
                <section className="relative">
                  <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full" />
                  <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-500 mb-8 uppercase tracking-widest">
                      <Star size={10} fill="currentColor" /> Trending #1 on GitHub Safety
                    </div>
                    <h1 className="text-8xl font-black tracking-tighter mb-6 text-white leading-[0.85]">
                      DETERMINISTIC <br />
                      <span className="text-emerald-500">ALIGNMENT.</span>
                    </h1>
                    <p className="text-2xl text-zinc-400 max-w-3xl leading-relaxed font-light">
                      The mathematical bridge for human-AI coexistence. DSG ensures that as intelligence evolves, 
                      it remains bound to the fundamental laws of human safety through <strong>Formal Verification</strong>.
                    </p>
                    <div className="flex gap-4 mt-12">
                      <button onClick={() => setActiveTab('simulator')} className="px-8 py-4 bg-emerald-500 text-black font-black rounded-xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                        LAUNCH COMMAND CENTER
                      </button>
                      <button onClick={() => setActiveTab('readme')} className="px-8 py-4 bg-white/5 border border-white/10 text-white font-black rounded-xl hover:bg-white/10 transition-all">
                        READ WHITEPAPER
                      </button>
                    </div>
                  </div>
                </section>

                {/* Ecosystem Organization View */}
                <section>
                  <div className="flex items-center justify-between mb-12">
                    <div>
                      <h2 className="text-3xl font-black text-white tracking-tighter mb-2">DSG Ecosystem</h2>
                      <p className="text-zinc-500 text-sm">A modular framework for verifiable AI safety.</p>
                    </div>
                    <div className="h-px flex-1 bg-white/5 mx-12 hidden md:block"></div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-[10px] text-zinc-600 font-bold uppercase">Total Stars</p>
                        <p className="text-xl font-black text-white">16.8k</p>
                      </div>
                      <div className="w-10 h-10 bg-zinc-900 rounded-lg flex items-center justify-center border border-white/5">
                        <Github size={20} className="text-zinc-500" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ecosystemRepos.map(repo => (
                      <div 
                        key={repo.id}
                        onClick={() => {
                          setSelectedRepo(repo);
                          setActiveTab('repo');
                        }}
                        className="group p-8 bg-[#0F0F11] border border-white/5 rounded-2xl hover:border-emerald-500/50 transition-all cursor-pointer flex flex-col relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl -mr-16 -mt-16 group-hover:bg-emerald-500/10 transition-colors" />
                        
                        <div className="flex justify-between items-start mb-6 relative z-10">
                          <div className="p-3 bg-zinc-900 rounded-xl border border-white/5 group-hover:border-emerald-500/30 transition-colors">
                            {repo.role === 'Core Engine' ? <Cpu size={20} className="text-emerald-500" /> :
                             repo.role === 'Audit & Proof' ? <ShieldCheck size={20} className="text-emerald-500" /> :
                             repo.role === 'Attack Simulator' ? <Zap size={20} className="text-emerald-500" /> :
                             repo.role === 'Interactive Demo' ? <Play size={20} className="text-emerald-500" /> :
                             repo.role === 'Performance' ? <BarChart3 size={20} className="text-emerald-500" /> :
                             <BookOpen size={20} className="text-emerald-500" />}
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-bold bg-black/30 px-2 py-1 rounded-full border border-white/5">
                            <Star size={10} fill="currentColor" /> {repo.stars}
                          </div>
                        </div>

                        <div className="relative z-10">
                          <h3 className="text-xl font-black mb-3 group-hover:text-emerald-500 transition-colors tracking-tight">{repo.name}</h3>
                          <p className="text-sm text-zinc-500 leading-relaxed mb-8 flex-1 font-medium">{repo.description}</p>
                        </div>

                        <div className="mt-auto flex items-center justify-between relative z-10">
                          <span className="text-[9px] px-2.5 py-1 bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500/20 font-black uppercase tracking-widest">
                            {repo.role}
                          </span>
                          <ArrowUpRight size={16} className="text-zinc-700 group-hover:text-emerald-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Technical Specs / Bento Grid */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 p-12 bg-[#0F0F11] border border-white/5 rounded-[2.5rem] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Code2 size={240} />
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-4xl font-black mb-6 tracking-tighter">Formal Logic Engine</h3>
                      <p className="text-xl text-zinc-400 leading-relaxed max-w-xl font-medium">
                        Unlike probabilistic guardrails that use "AI to check AI," DSG employs <strong>Z3 SMT Solvers</strong>. 
                        Decisions are binary based on mathematical proof, eliminating hallucination risk.
                      </p>
                      <div className="flex gap-8 mt-12">
                        <div>
                          <p className="text-[10px] text-zinc-600 font-bold uppercase mb-1">Latency</p>
                          <p className="text-2xl font-black text-emerald-500">4 µs</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-zinc-600 font-bold uppercase mb-1">Determinism</p>
                          <p className="text-2xl font-black text-emerald-500">100%</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-zinc-600 font-bold uppercase mb-1">Standard</p>
                          <p className="text-2xl font-black text-emerald-500">CCDAD-100</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-12 bg-emerald-500 rounded-[2.5rem] text-black flex flex-col justify-between group cursor-pointer hover:scale-[1.02] transition-transform shadow-[0_20px_60px_rgba(16,185,129,0.2)]">
                    <div className="flex justify-between items-start">
                      <Shield size={48} />
                      <ArrowUpRight size={32} />
                    </div>
                    <div>
                      <h3 className="text-3xl font-black mb-4 tracking-tighter leading-none">Zero-Drift <br />Guarantee</h3>
                      <p className="text-black/80 text-sm font-bold leading-relaxed">100% Deterministic execution across all cloud nodes via formal state hashing.</p>
                    </div>
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
                      <span className="text-[10px] font-bold uppercase tracking-wider">Deterministic Command Center</span>
                    </div>
                    <div className="p-6 flex-1 flex flex-col gap-6">
                      {/* Quick Actions */}
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { label: "Verify Integrity", icon: ShieldCheck, color: "text-emerald-500", prompt: "Run a full Z3 formal audit on the current system state to verify zero-drift integrity." },
                          { label: "Deploy Invariant", icon: Lock, color: "text-blue-500", prompt: "Deploy a new safety invariant: 'No state transition shall exceed 0.5 entropy threshold'." },
                          { label: "Analyze Drift", icon: Activity, color: "text-amber-500", prompt: "Perform a deep entropy analysis to detect any non-deterministic branching in the last 100 cycles." },
                          { label: "Stress Test", icon: Zap, color: "text-red-500", prompt: "Simulate an adversarial attack attempting to bypass the DSG gate and verify the BLOCK response." }
                        ].map((action, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setSimulationInput(action.prompt);
                              handleSimulate(action.prompt);
                            }}
                            className="flex items-center gap-3 p-3 bg-black/30 border border-white/5 rounded-xl hover:border-white/20 hover:bg-white/5 transition-all group text-left"
                          >
                            <action.icon size={16} className={`${action.color} group-hover:scale-110 transition-transform`} />
                            <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 group-hover:text-white leading-tight">{action.label}</span>
                          </button>
                        ))}
                      </div>

                      <div className="h-px bg-white/5 w-full" />

                      <div className="flex flex-col gap-3">
                        <p className="text-[10px] uppercase font-bold text-zinc-600 tracking-widest">Manual Override</p>
                        <textarea
                          value={simulationInput}
                          onChange={(e) => setSimulationInput(e.target.value)}
                          placeholder="Enter command for the agent..."
                          className="w-full h-32 bg-black/30 border border-white/5 rounded-lg p-4 text-sm focus:outline-none focus:border-emerald-500/50 resize-none font-mono"
                        />
                        <button
                          onClick={() => handleSimulate()}
                          disabled={isSimulating || !simulationInput.trim()}
                          className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20"
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
                    
                    {/* Z3 Live Proof Stream (Visual Only) */}
                    <div className="px-4 py-2 bg-black/50 border-b border-white/5 flex items-center gap-4 overflow-hidden whitespace-nowrap">
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-[8px] font-bold text-emerald-500/50 uppercase tracking-widest">Z3 Live Proof:</span>
                      </div>
                      <div className="text-[8px] font-mono text-zinc-600 animate-marquee">
                        (declare-fun x () Int) (assert ({">"} x 0)) (check-sat) (get-model) ... [PROVING INVARIANT_0x4F2] ... (define-fun state_transition () Bool (and (not drift) (valid_entropy))) ...
                      </div>
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
