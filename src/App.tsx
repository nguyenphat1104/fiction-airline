import React, { useState, useEffect } from "react";
import { 
  Building2, 
  Cpu, 
  FileText, 
  Download, 
  Play, 
  Layers, 
  GitCommit, 
  CheckCircle2, 
  FileCheck, 
  HelpCircle, 
  RefreshCw, 
  Sparkles, 
  ArrowRight, 
  Copy, 
  Check, 
  Plus, 
  Trash2,
  Bookmark,
  Scale
} from "lucide-react";
import { BusinessInput, ArchitecturalReport, LADR, C4Node } from "./types";
import { BUSINESS_PRESETS } from "./presets";
import C4Visualizer from "./components/C4Visualizer";

export default function App() {
  // Input State
  const [form, setForm] = useState<BusinessInput>({
    businessName: "ShopSphere",
    industry: "Retail / E-Commerce",
    description: "An online marketplace featuring catalog browsing, cart management, stripe checkout integration, inventory management, and shipping dispatch coordination.",
    users: "Customers, Store Admins, Warehouse Staff",
    techStack: "Next.js, Node.js, PostgreSQL, Redis, Stripe API, AWS ECS",
    goals: "Handle 10,000 concurrent pageviews, integrate PCI-compliant payment gateways, and achieve sub-second cart updates.",
    complexity: "enterprise"
  });

  // UI state
  const [activeTab, setActiveTab] = useState<"diagram" | "dsl" | "ladr" | "report">("diagram");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [report, setReport] = useState<ArchitecturalReport | null>(null);

  // New Custom LADR state
  const [showAddLadr, setShowAddLadr] = useState<boolean>(false);
  const [newLadr, setNewLadr] = useState<Omit<LADR, "id">>({
    title: "",
    status: "Proposed",
    date: new Date().toISOString().split("T")[0],
    context: "",
    decision: "",
    consequences: "",
    tags: []
  });

  // Load a business preset
  const handleLoadPreset = (preset: BusinessInput) => {
    setForm(preset);
    setError(null);
  };

  // Perform Gemini AI Architectural Analysis
  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to analyze business architecture.");
      }

      const data: ArchitecturalReport = await response.json();
      setReport(data);
      // Auto-switch to diagram view
      setActiveTab("diagram");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred. Please verify your GEMINI_API_KEY.");
    } finally {
      setLoading(false);
    }
  };

  // Run initial analysis on mount so the user has an immediate interactive experience
  useEffect(() => {
    handleAnalyze();
  }, []);

  // Copy Structurizr DSL to clipboard
  const handleCopyDSL = () => {
    if (!report?.structurizrDSL) return;
    navigator.clipboard.writeText(report.structurizrDSL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Export full architectural report as JSON
  const handleExportJSON = () => {
    if (!report) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${report.businessName.toLowerCase().replace(/\s+/g, "-")}-architecture-report.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Add custom LADR to the current report
  const handleAddCustomLadr = () => {
    if (!report) return;
    if (!newLadr.title || !newLadr.decision) {
      alert("Please fill out at least Title and Decision fields.");
      return;
    }

    const nextId = `LADR-00${report.ladrs.length + 1}`;
    const formattedLadr: LADR = {
      id: nextId,
      title: newLadr.title,
      status: newLadr.status as any,
      date: newLadr.date,
      context: newLadr.context || "No context specified.",
      decision: newLadr.decision,
      consequences: newLadr.consequences || "No specific consequences documented.",
      tags: newLadr.tags.length > 0 ? newLadr.tags : ["Custom"]
    };

    setReport({
      ...report,
      ladrs: [...report.ladrs, formattedLadr]
    });

    // Reset new LADR form
    setNewLadr({
      title: "",
      status: "Proposed",
      date: new Date().toISOString().split("T")[0],
      context: "",
      decision: "",
      consequences: "",
      tags: []
    });
    setShowAddLadr(false);
  };

  // Remove a LADR from the report list
  const handleRemoveLadr = (id: string) => {
    if (!report) return;
    setReport({
      ...report,
      ladrs: report.ladrs.filter(l => l.id !== id)
    });
  };

  // Modify LADR status directly in the UI
  const handleToggleLadrStatus = (id: string, currentStatus: string) => {
    if (!report) return;
    const statuses: LADR["status"][] = ["Proposed", "Accepted", "Superceded", "Rejected"];
    const nextIndex = (statuses.indexOf(currentStatus as any) + 1) % statuses.length;
    const nextStatus = statuses[nextIndex];

    setReport({
      ...report,
      ladrs: report.ladrs.map(l => l.id === id ? { ...l, status: nextStatus } : l)
    });
  };

  return (
    <div className="min-h-screen bg-[#F8F5F0] text-[#2D2D2D] font-sans flex flex-col antialiased">
      {/* Header Bar */}
      <header className="h-16 border-b border-[#E5E1D8] px-6 flex items-center justify-between bg-white shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#7C8974] rounded-lg flex items-center justify-center text-white font-mono font-bold text-lg shadow-sm">
            C4
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-[#4A5D4E] flex items-center gap-2">
              Architectura AI
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#F1EDE4] text-[#7C8974] font-medium font-mono">
                C4 Model & Structurizr DSL v2
              </span>
            </h1>
            <p className="text-xs text-[#A39E8F] -mt-0.5 font-sans">
              Autonomous Business Solution Blueprinting & Design Traceability Agent
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex bg-[#F1EDE4] rounded-md p-1 border border-[#E5E1D8]">
            <button 
              onClick={() => setActiveTab("diagram")}
              className={`px-3 py-1 text-xs font-semibold rounded transition-all ${
                activeTab === "diagram" ? "bg-white text-[#4A5D4E] shadow-sm" : "text-[#7C8974] hover:text-[#4A5D4E]"
              }`}
            >
              Interactive Map
            </button>
            <button 
              onClick={() => setActiveTab("dsl")}
              className={`px-3 py-1 text-xs font-semibold rounded transition-all ${
                activeTab === "dsl" ? "bg-white text-[#4A5D4E] shadow-sm" : "text-[#7C8974] hover:text-[#4A5D4E]"
              }`}
            >
              Structurizr DSL
            </button>
            <button 
              onClick={() => setActiveTab("ladr")}
              className={`px-3 py-1 text-xs font-semibold rounded transition-all ${
                activeTab === "ladr" ? "bg-white text-[#4A5D4E] shadow-sm" : "text-[#7C8974] hover:text-[#4A5D4E]"
              }`}
            >
              LADRs Log
            </button>
          </div>

          <button 
            disabled={!report}
            onClick={handleExportJSON}
            className="bg-[#7C8974] hover:bg-[#6A7663] text-white px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
            title="Download the full C4 model, DSL and LADR specification as a structured JSON file"
            id="export-report-btn"
          >
            <Download className="w-4 h-4" />
            <span>Export JSON Report</span>
          </button>
        </div>
      </header>

      {/* Preset Pickers */}
      <div className="bg-[#FAF9F6] border-b border-[#E5E1D8] px-6 py-2.5 flex items-center gap-3 overflow-x-auto shrink-0">
        <span className="text-[10px] font-bold text-[#A39E8F] uppercase tracking-wider font-mono shrink-0">
          Architecture Templates:
        </span>
        <div className="flex items-center gap-2">
          {BUSINESS_PRESETS.map((preset, idx) => {
            const isSelected = form.businessName === preset.businessName;
            return (
              <button
                key={idx}
                onClick={() => handleLoadPreset(preset)}
                className={`px-3 py-1 text-xs rounded-full border transition-all text-left truncate max-w-[240px] font-medium ${
                  isSelected 
                    ? "bg-[#4A5D4E] text-white border-[#4A5D4E] shadow-sm" 
                    : "bg-white text-[#7C8974] border-[#E5E1D8] hover:bg-[#F1EDE4]"
                }`}
                id={`preset-btn-${preset.businessName}`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Body */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left Column - Business Analysis Input */}
        <section className="w-full lg:w-[420px] border-r border-[#E5E1D8] bg-white p-6 flex flex-col gap-5 overflow-y-auto shrink-0">
          <div className="border-b border-[#E5E1D8] pb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#7C8974] flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#4A5D4E]" />
              Business Requirements Intake
            </h2>
            <p className="text-xs text-[#A39E8F] mt-1">
              Provide your business rules, user definitions, and architecture targets to formulate the C4 model.
            </p>
          </div>

          {/* Form Inputs */}
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-[11px] font-bold font-mono text-[#4A5D4E] uppercase block mb-1">
                Business / System Name
              </label>
              <input 
                type="text"
                value={form.businessName}
                onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg border border-[#E5E1D8] bg-[#F8F5F0] text-sm focus:outline-none focus:ring-1 focus:ring-[#7C8974]"
                placeholder="e.g. ShopSphere"
                id="input-business-name"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold font-mono text-[#4A5D4E] uppercase block mb-1">
                Industry Sector
              </label>
              <input 
                type="text"
                value={form.industry}
                onChange={(e) => setForm({ ...form, industry: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg border border-[#E5E1D8] bg-[#F8F5F0] text-sm focus:outline-none focus:ring-1 focus:ring-[#7C8974]"
                placeholder="e.g. Fintech, Healthcare, SaaS"
                id="input-industry"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold font-mono text-[#4A5D4E] uppercase block mb-1">
                Core Operations & Workflows
              </label>
              <textarea 
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={4}
                className="w-full px-3.5 py-2 rounded-lg border border-[#E5E1D8] bg-[#F8F5F0] text-sm focus:outline-none focus:ring-1 focus:ring-[#7C8974] resize-none leading-relaxed"
                placeholder="Describe the operational actions, transactional needs, and core systems..."
                id="input-description"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold font-mono text-[#4A5D4E] uppercase block mb-1">
                Primary Actors & Users
              </label>
              <input 
                type="text"
                value={form.users}
                onChange={(e) => setForm({ ...form, users: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg border border-[#E5E1D8] bg-[#F8F5F0] text-sm focus:outline-none focus:ring-1 focus:ring-[#7C8974]"
                placeholder="e.g. Customers, Delivery Agents, Admins"
                id="input-users"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold font-mono text-[#4A5D4E] uppercase block mb-1">
                Preferred Technology Stack
              </label>
              <input 
                type="text"
                value={form.techStack}
                onChange={(e) => setForm({ ...form, techStack: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg border border-[#E5E1D8] bg-[#F8F5F0] text-sm focus:outline-none focus:ring-1 focus:ring-[#7C8974]"
                placeholder="e.g. Next.js, Node.js, PostgreSQL, Docker, AWS"
                id="input-techstack"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold font-mono text-[#4A5D4E] uppercase block mb-1">
                Non-Functional Goals & SLA Target
              </label>
              <input 
                type="text"
                value={form.goals}
                onChange={(e) => setForm({ ...form, goals: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg border border-[#E5E1D8] bg-[#F8F5F0] text-sm focus:outline-none focus:ring-1 focus:ring-[#7C8974]"
                placeholder="e.g. Horizontal auto-scaling, HIPAA compliance, sub-second responses"
                id="input-goals"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold font-mono text-[#4A5D4E] uppercase block mb-1">
                Scale Profile & Complexity
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["simple", "medium", "enterprise"] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setForm({ ...form, complexity: level })}
                    className={`py-1.5 rounded-lg text-xs capitalize font-medium border transition-all ${
                      form.complexity === level 
                        ? "bg-[#4A5D4E] text-white border-[#4A5D4E]" 
                        : "bg-[#F8F5F0] text-[#7C8974] border-[#E5E1D8] hover:bg-[#F1EDE4]"
                    }`}
                    id={`complexity-btn-${level}`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Error Prompt */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-xs font-sans mt-2">
              <span className="font-bold block mb-0.5">Analysis Failed</span>
              {error}
            </div>
          )}

          {/* Call-to-action button */}
          <div className="mt-auto pt-4 border-t border-[#E5E1D8]">
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full bg-[#4A5D4E] hover:bg-[#3D4D3F] text-white py-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              id="analyze-submit-btn"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#F1EDE4]" />
                  <span>Structuring Architecture Blueprint...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>Synthesize C4 & LADR Blueprint</span>
                </>
              )}
            </button>
          </div>
        </section>

        {/* Right Column - Tabs and Visualization outputs */}
        <section className="flex-1 p-6 overflow-y-auto flex flex-col gap-6">
          
          {/* Summary Banner from Model */}
          {report ? (
            <div className="bg-white border border-[#E5E1D8] rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
              <div className="flex-1">
                <span className="text-[10px] font-bold font-mono bg-[#E5E1D8] text-[#4A5D4E] px-2 py-0.5 rounded uppercase tracking-wider">
                  Active System Bounds Context
                </span>
                <h2 className="text-xl font-bold text-[#4A5D4E] mt-2 font-sans tracking-tight">
                  {report.businessName} Architecture Blueprint
                </h2>
                <p className="text-xs text-[#7C8974] mt-1 font-mono">
                  Industry Focus: <span className="text-[#4A5D4E] font-sans font-medium">{report.industry}</span>
                </p>
                <p className="text-xs text-[#2D2D2D] mt-2.5 leading-relaxed">
                  {report.summary}
                </p>
              </div>

              {/* Quick stats panel */}
              <div className="flex gap-2 shrink-0 md:border-l md:border-[#E5E1D8] md:pl-6">
                <div className="bg-[#FAF9F6] border border-[#E5E1D8] rounded-xl p-3 text-center min-w-[75px]">
                  <span className="text-xs text-[#A39E8F] block font-mono">Containers</span>
                  <span className="text-lg font-bold text-[#4A5D4E] font-mono">
                    {report.c4Model.nodes.filter(n => n.type === 'container').length}
                  </span>
                </div>
                <div className="bg-[#FAF9F6] border border-[#E5E1D8] rounded-xl p-3 text-center min-w-[75px]">
                  <span className="text-xs text-[#A39E8F] block font-mono">Relations</span>
                  <span className="text-lg font-bold text-[#4A5D4E] font-mono">
                    {report.c4Model.relations.length}
                  </span>
                </div>
                <div className="bg-[#FAF9F6] border border-[#E5E1D8] rounded-xl p-3 text-center min-w-[75px]">
                  <span className="text-xs text-[#A39E8F] block font-mono">LADRs</span>
                  <span className="text-lg font-bold text-[#4A5D4E] font-mono">
                    {report.ladrs.length}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-[#E5E1D8] rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-4 min-h-[140px] shadow-sm">
              <RefreshCw className="w-8 h-8 text-[#7C8974] animate-spin" />
              <div>
                <h3 className="text-sm font-bold text-[#4A5D4E]">Initializing Solution Architect Sandbox</h3>
                <p className="text-xs text-[#A39E8F] max-w-[400px] mt-1">
                  Connecting to server-side Gemini 3.5 Flash Model. Fetching deep C4 structures and LADRs...
                </p>
              </div>
            </div>
          )}

          {/* Navigation Tab Header inside content */}
          {report && (
            <div className="flex border-b border-[#E5E1D8] gap-4">
              <button
                onClick={() => setActiveTab("diagram")}
                className={`pb-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                  activeTab === "diagram" 
                    ? "border-[#4A5D4E] text-[#4A5D4E]" 
                    : "border-transparent text-[#A39E8F] hover:text-[#7C8974]"
                }`}
                id="tab-btn-diagram"
              >
                1. System Mapping (C4 Diagram)
              </button>
              <button
                onClick={() => setActiveTab("dsl")}
                className={`pb-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                  activeTab === "dsl" 
                    ? "border-[#4A5D4E] text-[#4A5D4E]" 
                    : "border-transparent text-[#A39E8F] hover:text-[#7C8974]"
                }`}
                id="tab-btn-dsl"
              >
                2. Structurizr DSL Block
              </button>
              <button
                onClick={() => setActiveTab("ladr")}
                className={`pb-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                  activeTab === "ladr" 
                    ? "border-[#4A5D4E] text-[#4A5D4E]" 
                    : "border-transparent text-[#A39E8F] hover:text-[#7C8974]"
                }`}
                id="tab-btn-ladr"
              >
                3. Architectural Decisions (LADRs)
              </button>
              <button
                onClick={() => setActiveTab("report")}
                className={`pb-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                  activeTab === "report" 
                    ? "border-[#4A5D4E] text-[#4A5D4E]" 
                    : "border-transparent text-[#A39E8F] hover:text-[#7C8974]"
                }`}
                id="tab-btn-report"
              >
                4. Structured Report Summary
              </button>
            </div>
          )}

          {/* Tab Panes */}
          {report && (
            <div className="flex-1 flex flex-col gap-6">
              
              {/* Tab 1: C4 Model Diagram Visualizer */}
              {activeTab === "diagram" && (
                <div className="flex flex-col gap-6 transition-all duration-300">
                  <C4Visualizer c4Model={report.c4Model} />
                  
                  {/* Technical Recommendations Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    
                    <div className="bg-white border border-[#E5E1D8] rounded-xl p-5 shadow-sm text-left">
                      <div className="flex items-center gap-2 border-b border-[#E5E1D8] pb-2 mb-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                        <h4 className="text-xs font-bold font-mono text-[#4A5D4E] uppercase">
                          Scalability Strategy
                        </h4>
                      </div>
                      <ul className="list-disc list-inside space-y-1.5 text-xs text-[#2D2D2D] leading-relaxed pl-1">
                        {report.recommendations.scalability.map((item, idx) => (
                          <li key={idx} className="marker:text-[#7C8974]">{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-white border border-[#E5E1D8] rounded-xl p-5 shadow-sm text-left">
                      <div className="flex items-center gap-2 border-b border-[#E5E1D8] pb-2 mb-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <h4 className="text-xs font-bold font-mono text-[#4A5D4E] uppercase">
                          Security Controls
                        </h4>
                      </div>
                      <ul className="list-disc list-inside space-y-1.5 text-xs text-[#2D2D2D] leading-relaxed pl-1">
                        {report.recommendations.security.map((item, idx) => (
                          <li key={idx} className="marker:text-[#7C8974]">{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-white border border-[#E5E1D8] rounded-xl p-5 shadow-sm text-left">
                      <div className="flex items-center gap-2 border-b border-[#E5E1D8] pb-2 mb-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                        <h4 className="text-xs font-bold font-mono text-[#4A5D4E] uppercase">
                          Resilience & Recovery
                        </h4>
                      </div>
                      <ul className="list-disc list-inside space-y-1.5 text-xs text-[#2D2D2D] leading-relaxed pl-1">
                        {report.recommendations.resilience.map((item, idx) => (
                          <li key={idx} className="marker:text-[#7C8974]">{item}</li>
                        ))}
                      </ul>
                    </div>

                  </div>
                </div>
              )}

              {/* Tab 2: Structurizr DSL Output */}
              {activeTab === "dsl" && (
                <div className="flex flex-col gap-4 bg-white border border-[#E5E1D8] rounded-2xl p-6 shadow-sm text-left">
                  <div className="flex items-center justify-between border-b border-[#E5E1D8] pb-3">
                    <div>
                      <h3 className="text-sm font-bold text-[#4A5D4E] font-sans">
                        Structurizr DSL Code Block
                      </h3>
                      <p className="text-xs text-[#A39E8F] mt-0.5">
                        Import this architecture representation directly into Structurizr toolkit or Structurizr Lite.
                      </p>
                    </div>

                    <button
                      onClick={handleCopyDSL}
                      className="flex items-center gap-2 bg-[#F1EDE4] hover:bg-[#E5E1D8] border border-[#E5E1D8] text-[#4A5D4E] px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all"
                      id="copy-dsl-btn"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span>Copied Code</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy DSL</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="relative">
                    <pre className="bg-[#2D2D2D] text-[#D4D4D4] p-5 rounded-xl text-xs font-mono overflow-x-auto border border-slate-800 leading-relaxed shadow-inner max-h-[500px]">
                      <code>{report.structurizrDSL}</code>
                    </pre>
                  </div>

                  <div className="bg-[#FAF9F6] border border-[#E5E1D8] rounded-xl p-4 flex gap-3 text-xs text-[#7C8974]">
                    <HelpCircle className="w-5 h-5 shrink-0 text-[#4A5D4E]" />
                    <div>
                      <span className="font-bold text-[#4A5D4E] block mb-0.5">Integration Instructions</span>
                      To view or compile this block, download Structurizr CLI or navigate to <a href="https://structurizr.com/dsl" target="_blank" rel="noreferrer" className="underline font-bold hover:text-[#4A5D4E]">structurizr.com/dsl</a>, paste the code directly, and enjoy instant synchronized visualizations.
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Lightweight ADR (LADRs) Timeline */}
              {activeTab === "ladr" && (
                <div className="flex flex-col gap-6 text-left">
                  
                  {/* ADR Intake Toggle Header */}
                  <div className="flex items-center justify-between border-b border-[#E5E1D8] pb-3">
                    <div>
                      <h3 className="text-sm font-bold text-[#4A5D4E] font-sans">
                        Lightweight Architectural Decision Records (LADRs)
                      </h3>
                      <p className="text-xs text-[#A39E8F] mt-0.5">
                        Ensure long-term architectural traceability, trade-off understanding, and change logs.
                      </p>
                    </div>

                    <button
                      onClick={() => setShowAddLadr(!showAddLadr)}
                      className="bg-[#4A5D4E] hover:bg-[#3D4D3F] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                      id="ladr-add-btn"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{showAddLadr ? "Cancel New ADR" : "Log New Decision"}</span>
                    </button>
                  </div>

                  {/* Add LADR Form */}
                  {showAddLadr && (
                    <div className="bg-white border border-[#E5E1D8] rounded-2xl p-5 shadow-sm flex flex-col gap-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#7C8974] border-b border-[#E5E1D8] pb-1.5">
                        Record New Architectural Decision
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-bold font-mono text-[#4A5D4E] uppercase block mb-1">
                            ADR Title
                          </label>
                          <input 
                            type="text"
                            value={newLadr.title}
                            onChange={(e) => setNewLadr({ ...newLadr, title: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-lg border border-[#E5E1D8] bg-[#F8F5F0] text-xs focus:outline-none focus:ring-1 focus:ring-[#7C8974]"
                            placeholder="e.g. Choose Apache Kafka for Event Streams"
                            id="new-ladr-title"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold font-mono text-[#4A5D4E] uppercase block mb-1">
                            Status
                          </label>
                          <select
                            value={newLadr.status}
                            onChange={(e) => setNewLadr({ ...newLadr, status: e.target.value as any })}
                            className="w-full px-3 py-1.5 rounded-lg border border-[#E5E1D8] bg-[#F8F5F0] text-xs focus:outline-none focus:ring-1 focus:ring-[#7C8974]"
                            id="new-ladr-status"
                          >
                            <option value="Proposed">Proposed</option>
                            <option value="Accepted">Accepted</option>
                            <option value="Superceded">Superceded</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold font-mono text-[#4A5D4E] uppercase block mb-1">
                          Context & Background Problem
                        </label>
                        <textarea 
                          value={newLadr.context}
                          onChange={(e) => setNewLadr({ ...newLadr, context: e.target.value })}
                          rows={2}
                          className="w-full px-3 py-1.5 rounded-lg border border-[#E5E1D8] bg-[#F8F5F0] text-xs focus:outline-none focus:ring-1 focus:ring-[#7C8974] resize-none"
                          placeholder="What physical constraint or feature trigger warrants a technical decision?"
                          id="new-ladr-context"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold font-mono text-[#4A5D4E] uppercase block mb-1">
                          Explicit Architectural Decision Made
                        </label>
                        <textarea 
                          value={newLadr.decision}
                          onChange={(e) => setNewLadr({ ...newLadr, decision: e.target.value })}
                          rows={2}
                          className="w-full px-3 py-1.5 rounded-lg border border-[#E5E1D8] bg-[#F8F5F0] text-xs focus:outline-none focus:ring-1 focus:ring-[#7C8974] resize-none"
                          placeholder="What is the chosen framework, path, or design compromise?"
                          id="new-ladr-decision"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold font-mono text-[#4A5D4E] uppercase block mb-1">
                          Consequences & Outcomes
                        </label>
                        <textarea 
                          value={newLadr.consequences}
                          onChange={(e) => setNewLadr({ ...newLadr, consequences: e.target.value })}
                          rows={2}
                          className="w-full px-3 py-1.5 rounded-lg border border-[#E5E1D8] bg-[#F8F5F0] text-xs focus:outline-none focus:ring-1 focus:ring-[#7C8974] resize-none"
                          placeholder="What trade-offs or downstream migration requirements are expected?"
                          id="new-ladr-consequences"
                        />
                      </div>

                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setShowAddLadr(false)}
                          className="px-4 py-1.5 border border-[#E5E1D8] rounded-lg text-xs font-semibold text-[#7C8974] hover:bg-[#F1EDE4]"
                        >
                          Discard
                        </button>
                        <button
                          onClick={handleAddCustomLadr}
                          className="px-4 py-1.5 bg-[#4A5D4E] hover:bg-[#3D4D3F] text-white rounded-lg text-xs font-semibold"
                          id="new-ladr-save-btn"
                        >
                          Commit Decision Record
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Active Decision Records Timeline */}
                  <div className="flex flex-col gap-4">
                    {report.ladrs.map((ladr, index) => {
                      // Status styling
                      const statusColor = 
                        ladr.status === "Accepted" ? "bg-emerald-100 text-emerald-800 border-emerald-200" :
                        ladr.status === "Proposed" ? "bg-indigo-100 text-indigo-800 border-indigo-200" :
                        ladr.status === "Rejected" ? "bg-red-100 text-red-800 border-red-200" :
                        "bg-amber-100 text-amber-800 border-amber-200";

                      return (
                        <div 
                          key={ladr.id} 
                          className="bg-white border border-[#E5E1D8] rounded-xl p-5 shadow-sm relative hover:shadow transition-shadow flex flex-col gap-3 text-left"
                        >
                          <div className="flex items-start justify-between border-b border-[#E5E1D8] pb-2.5">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono font-bold text-[#7C8974] bg-[#F1EDE4] px-2 py-0.5 rounded border border-[#E5E1D8]">
                                {ladr.id}
                              </span>
                              <h4 className="text-sm font-bold text-[#4A5D4E]">
                                {ladr.title}
                              </h4>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleToggleLadrStatus(ladr.id, ladr.status)}
                                className={`text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full border cursor-pointer ${statusColor}`}
                                title="Click to cycle status of this architectural decision"
                              >
                                {ladr.status}
                              </button>

                              <button
                                onClick={() => handleRemoveLadr(ladr.id)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded"
                                title="Delete this decision record"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs mt-1.5">
                            <div>
                              <span className="text-[10px] font-bold font-mono text-[#A39E8F] uppercase block mb-1">
                                Context
                              </span>
                              <p className="text-slate-700 leading-relaxed font-sans text-[11px]">
                                {ladr.context}
                              </p>
                            </div>

                            <div>
                              <span className="text-[10px] font-bold font-mono text-[#A39E8F] uppercase block mb-1">
                                Decision
                              </span>
                              <p className="text-[#4A5D4E] font-medium leading-relaxed font-sans text-[11px]">
                                {ladr.decision}
                              </p>
                            </div>

                            <div>
                              <span className="text-[10px] font-bold font-mono text-[#A39E8F] uppercase block mb-1">
                                Consequences
                              </span>
                              <p className="text-slate-600 leading-relaxed font-sans text-[11px]">
                                {ladr.consequences}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#E5E1D8]/50">
                            <div className="flex items-center gap-1">
                              {ladr.tags.map((tag, tagIdx) => (
                                <span 
                                  key={tagIdx} 
                                  className="text-[9px] font-mono text-[#7C8974] bg-[#FAF9F6] border border-[#E5E1D8] px-1.5 py-0.5 rounded"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <span className="text-[9px] font-mono text-[#A39E8F]">
                              Logged: {ladr.date}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                </div>
              )}

              {/* Tab 4: Full JSON Report */}
              {activeTab === "report" && (
                <div className="bg-white border border-[#E5E1D8] rounded-2xl p-6 shadow-sm text-left flex flex-col gap-4">
                  <div className="flex items-center justify-between border-b border-[#E5E1D8] pb-3">
                    <div>
                      <h3 className="text-sm font-bold text-[#4A5D4E]">
                        Structured Architectural Report Summary (JSON Payload)
                      </h3>
                      <p className="text-xs text-[#A39E8F] mt-0.5">
                        This reflects the entire C4 system mapping, live decision logs, and platform recommendations.
                      </p>
                    </div>

                    <button
                      onClick={handleExportJSON}
                      className="bg-[#7C8974] hover:bg-[#6A7663] text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2"
                      id="report-tab-download-btn"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download JSON Report</span>
                    </button>
                  </div>

                  <div className="relative">
                    <pre className="bg-[#2D2D2D] text-emerald-400 p-5 rounded-xl text-xs font-mono overflow-x-auto border border-slate-800 leading-relaxed shadow-inner max-h-[500px]">
                      <code>{JSON.stringify(report, null, 2)}</code>
                    </pre>
                  </div>
                </div>
              )}

            </div>
          )}

        </section>

      </main>

      {/* Footer bar */}
      <footer className="h-8 border-t border-[#E5E1D8] px-6 flex items-center justify-between bg-[#F1EDE4] text-[10px] text-[#7C8974] shrink-0 font-mono">
        <div className="flex gap-4">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7C8974] inline-block animate-pulse" />
            AGENT STATUS: READY
          </span>
          <span>● ENGINE: GEMINI 3.5 FLASH</span>
          <span>● PLATFORM: CLOUD CONTAINER</span>
        </div>
        <div className="italic">
          Verified C4 Model Structure - Lightweight ADR tracing active.
        </div>
      </footer>
    </div>
  );
}
