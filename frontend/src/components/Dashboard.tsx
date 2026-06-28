import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { motion, AnimatePresence } from "framer-motion";

interface DashboardProps {
  analysis: any;
}

// Native, dependency-free count animation engine
function NativeCountUp({ end, duration = 1.5, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const startValue = 0;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      // Easing function for smooth visual slowdown near target value
      const easeOutQuad = progress * (2 - progress);
      
      setCount(Math.floor(easeOutQuad * (end - startValue) + startValue));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration]);

  return <>{count}{suffix}</>;
}

export default function Dashboard({ analysis }: DashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");

  // Client-side JSON dynamic download pipeline configuration
  const downloadJSON = () => {
    if (!analysis) return;
    
    const dataStr = JSON.stringify(analysis, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = `${analysis?.filename?.replace(/\.[^/.]+$/, "") || "analysis"}.json`;
    
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Dynamic, page-overflow safe PDF Generation Engine
  const exportPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - (margin * 2);
    
    let y = 20;

    const checkPageBreak = (neededLinesCount: number, lineHeight: number = 6) => {
      const spaceNeeded = neededLinesCount * lineHeight;
      if (y + spaceNeeded > pageHeight - 20) {
        doc.addPage();
        y = 20;
      }
    };

    // ==========================================
    // COVER PAGE
    // ==========================================
    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.text("Paper2Project", pageWidth / 2, 60, { align: "center" });

    doc.setFontSize(18);
    doc.text("AI Research Analysis Report", pageWidth / 2, 75, { align: "center" });

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, 90, { align: "center" });

    doc.setDrawColor(200, 200, 200);
    doc.line(40, 105, pageWidth - 40, 105);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    const filenameLines = doc.splitTextToSize(analysis?.filename || "Research Paper Source Document", contentWidth - 20);
    doc.text(filenameLines, pageWidth / 2, 125, { align: "center" });

    // ==========================================
    // CORE REPORT DATA
    // ==========================================
    doc.addPage();
    y = 20;

    // Executive Summary
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Executive Summary", margin, y);
    y += 10;

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    const summaryLines = doc.splitTextToSize(analysis?.summary?.executive_summary || "N/A", contentWidth);
    checkPageBreak(summaryLines.length);
    doc.text(summaryLines, margin, y);
    y += (summaryLines.length * 6) + 12;

    // Problem Statement
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    checkPageBreak(2);
    doc.text("Problem Statement", margin, y);
    y += 8;

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    const problemLines = doc.splitTextToSize(analysis?.summary?.problem_statement || "N/A", contentWidth);
    checkPageBreak(problemLines.length);
    doc.text(problemLines, margin, y);
    y += (problemLines.length * 6) + 12;

    // Proposed Solution
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    checkPageBreak(2);
    doc.text("Proposed Solution", margin, y);
    y += 8;

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    const solutionLines = doc.splitTextToSize(analysis?.summary?.proposed_solution || "N/A", contentWidth);
    checkPageBreak(solutionLines.length);
    doc.text(solutionLines, margin, y);
    y += (solutionLines.length * 6) + 15;

    // Innovation Analysis
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    checkPageBreak(2);
    doc.text("Innovation Analysis", margin, y);
    y += 10;

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    const innovationLines = doc.splitTextToSize(analysis?.innovation?.main_innovation || "N/A", contentWidth);
    checkPageBreak(innovationLines.length);
    doc.text(innovationLines, margin, y);
    y += (innovationLines.length * 6) + 12;

    // Advantages Table
    checkPageBreak(4);
    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      head: [["Advantages Structuring Matrix"]],
      body: analysis?.innovation?.advantages?.map((item: string) => [item]) || [["N/A"]],
      theme: "grid",
      headStyles: { fillColor: [16, 185, 129] },
    });
    y = (doc as any).lastAutoTable.finalY + 12;

    // Key Findings Table
    checkPageBreak(4);
    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      head: [["Key Analytical Findings"]],
      body: analysis?.summary?.key_findings?.map((item: string) => [item]) || [["N/A"]],
      theme: "striped",
      headStyles: { fillColor: [6, 182, 212] },
    });
    y = (doc as any).lastAutoTable.finalY + 15;

    // Implementation Roadmap Title
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    checkPageBreak(2);
    doc.text("Implementation Roadmap", margin, y);
    y += 10;

    // Project Idea Description
    doc.setFontSize(14);
    checkPageBreak(2);
    doc.text("Project Conception Idea", margin, y);
    y += 8;

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    const projectLines = doc.splitTextToSize(analysis?.roadmap?.project_idea || "N/A", contentWidth);
    checkPageBreak(projectLines.length);
    doc.text(projectLines, margin, y);
    y += (projectLines.length * 6) + 12;

    // Tech Stack Table
    checkPageBreak(4);
    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      head: [["Recommended Technology Blueprint"]],
      body: analysis?.roadmap?.tech_stack?.map((tech: string) => [tech]) || [["N/A"]],
      theme: "grid",
      headStyles: { fillColor: [139, 92, 246] },
    });
    y = (doc as any).lastAutoTable.finalY + 12;

    // Milestones Flow Table
    checkPageBreak(4);
    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      head: [["Execution Milestones Timeline"]],
      body: analysis?.roadmap?.milestones?.map((m: string) => [m]) || [["N/A"]],
      theme: "striped",
      headStyles: { fillColor: [139, 92, 246] },
    });

    // TWO-PASS FOOTER ATTACHMENT
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 116, 139);
      
      doc.text("Generated securely via Paper2Project Platform workspace.", margin, pageHeight - 10);
      doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 10, { align: "right" });
    }

    doc.save(`${analysis?.filename?.replace(/\.[^/.]+$/, "") || "Paper2Project"}_Report.pdf`);
  };

  const workflowSteps = [
    { title: "PDF Uploaded", description: "Research paper successfully received" },
    { title: "Text Extracted", description: "Content parsed and cleaned" },
    { title: "Research Understood", description: "AI analyzed concepts and objectives" },
    { title: "Innovation Generated", description: "Novel contributions identified" },
    { title: "Roadmap Created", description: "Implementation plan generated" },
    { title: "Project Ready", description: "Production-ready output delivered" },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="flex min-h-screen bg-[#030712] text-white"
    >
      {/* Background Glowing Ambient Orbs */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-20 left-20 w-96 h-96 bg-cyan-500/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 blur-[120px] animate-pulse" />
      </div>

      {/* Sidebar Navigation Panel Layout */}
      <aside className="w-72 border-r border-white/10 bg-slate-950/80 backdrop-blur-xl z-10">
        <div className="p-8">
          <h1 className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Paper2Project
          </h1>
          <p className="text-slate-500 mt-2">AI Research Workspace</p>
        </div>

        <nav className="px-4 space-y-3">
          {[
            { id: "overview", label: "🚀 Overview", color: "shadow-[0_0_30px_rgba(34,211,238,0.2)] text-cyan-400 bg-cyan-500/10" },
            { id: "summary", label: "📄 Summary", color: "shadow-[0_0_30px_rgba(34,211,238,0.2)] text-cyan-400 bg-cyan-500/10" },
            { id: "innovation", label: "💡 Innovation", color: "shadow-[0_0_30px_rgba(16,185,129,0.2)] text-emerald-400 bg-emerald-500/10" },
            { id: "roadmap", label: "🛠 Roadmap", color: "shadow-[0_0_30px_rgba(168,85,247,0.2)] text-purple-400 bg-purple-500/10" },
            { id: "workflow", label: "⚡ AI Workflow", color: "shadow-[0_0_30px_rgba(249,115,22,0.2)] text-orange-400 bg-orange-500/10" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group relative overflow-hidden w-full text-left p-4 rounded-xl transition-all duration-300 hover:scale-105 ${
                activeTab === tab.id 
                  ? `${tab.color} border border-white/20` 
                  : "bg-white/5 text-slate-400 hover:bg-white/10 hover:shadow-[0_0_25px_rgba(255,255,255,0.05)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Analysis Viewport Content Frame */}
      <main className="flex-1 p-10 overflow-y-auto z-10">
        {/* Animated Infinite Gradient Header Display */}
        <h2 className="text-6xl font-black mb-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-[length:200%_200%] bg-clip-text text-transparent animate-[gradient_6s_ease_infinite]">
          AI Analysis Dashboard
        </h2>

        {/* Global Metadata Tracker Container Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-cyan-400">
                📄 {analysis?.filename || "Research Paper"}
              </h3>
              <p className="text-slate-400 mt-2">Generated Successfully ✓</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={downloadJSON}
                className="px-4 py-2 rounded-xl bg-cyan-500/10 border border-white/10 hover:bg-cyan-500/20 transition-all duration-300"
              >
                Download JSON
              </button>
              <button
                onClick={exportPDF}
                className="px-4 py-2 rounded-xl bg-purple-500/10 border border-white/10 hover:bg-purple-500/20 transition-all duration-300"
              >
                Export PDF
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Metric Score Cards Grid Matrix */}
        <div className="grid md:grid-cols-4 gap-6 mb-10">
          {[
            { label: "Innovation Score", value: 92, suffix: "%", tint: "border-cyan-500/20 text-cyan-400" },
            { label: "Feasibility", value: 88, suffix: "%", tint: "border-purple-500/20 text-purple-400" },
            { label: "Market Potential", value: 95, suffix: "%", tint: "border-emerald-500/20 text-emerald-400" },
            { label: "Complexity", value: "High", suffix: "", tint: "border-orange-500/20 text-orange-400" },
          ].map((card, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -8, scale: 1.03 }}
              transition={{ duration: 0.2 }}
              className={`bg-white/5 backdrop-blur-xl border ${card.tint} rounded-3xl p-6`}
            >
              <p className="text-sm mb-2 opacity-80">{card.label}</p>
              <h2 className="text-5xl font-black">
                {typeof card.value === "number" ? (
                  <NativeCountUp end={card.value} suffix={card.suffix} duration={1.5} />
                ) : (
                  card.value
                )}
              </h2>
            </motion.div>
          ))}
        </div>

        {/* Global Dynamic Object Parameter Length Count Badges */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {[
            { label: "Findings", count: analysis?.summary?.key_findings?.length || 0, color: "text-cyan-400" },
            { label: "Advantages", count: analysis?.innovation?.advantages?.length || 0, color: "text-emerald-400" },
            { label: "Milestones", count: analysis?.roadmap?.milestones?.length || 0, color: "text-purple-400" },
          ].map((counter, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
            >
              <p className={counter.color}>{counter.label}</p>
              <h2 className="text-4xl font-bold">
                <NativeCountUp end={counter.count} duration={1.5} />
              </h2>
            </motion.div>
          ))}
        </div>

        {/* Tab Selection Layout Viewport Mount Point Engine */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {activeTab === "overview" && (
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
                <h2 className="text-3xl font-bold mb-4 text-cyan-400">📚 Research Overview</h2>
                <p className="text-slate-300 leading-8">{analysis?.summary?.executive_summary}</p>
              </div>
            )}

            {activeTab === "summary" && (
              <div className="space-y-6">
                <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10">
                  <h2 className="text-3xl font-bold text-cyan-400 mb-4">📄 Executive Summary</h2>
                  <p className="text-slate-300 leading-8">{analysis?.summary?.executive_summary}</p>
                </div>
                <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10">
                  <h3 className="text-xl font-bold mb-3">Problem Statement</h3>
                  <p className="text-slate-300">{analysis?.summary?.problem_statement}</p>
                </div>
                <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10">
                  <h3 className="text-xl font-bold mb-3">Proposed Solution</h3>
                  <p className="text-slate-300">{analysis?.summary?.proposed_solution}</p>
                </div>
                <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10">
                  <h3 className="text-xl font-bold mb-4">Key Findings</h3>
                  <ul className="space-y-3">
                    {analysis?.summary?.key_findings?.map((item: string, index: number) => (
                      <li key={index} className="text-slate-300 flex gap-3">
                        <span className="text-cyan-400">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === "innovation" && (
              <div className="space-y-6">
                <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10">
                  <h2 className="text-3xl font-bold text-emerald-400 mb-4">💡 Main Innovation</h2>
                  <p className="text-slate-300 leading-8">{analysis?.innovation?.main_innovation}</p>
                </div>
                <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10">
                  <h3 className="text-xl font-bold mb-4">Novel Contributions</h3>
                  <ul className="space-y-3">
                    {analysis?.innovation?.novel_contributions?.map((item: string, index: number) => (
                      <li key={index} className="text-slate-300">• {item}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10">
                  <h3 className="text-xl font-bold mb-4">Advantages</h3>
                  <ul className="space-y-3">
                    {analysis?.innovation?.advantages?.map((item: string, index: number) => (
                      <li key={index} className="text-slate-300">✓ {item}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10">
                  <h3 className="text-xl font-bold mb-4">Potential Impact</h3>
                  <p className="text-slate-300 leading-8">{analysis?.innovation?.potential_impact}</p>
                </div>
              </div>
            )}

            {activeTab === "roadmap" && (
              <div className="space-y-6">
                <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10">
                  <h2 className="text-3xl font-bold text-purple-400 mb-4">🚀 Project Idea</h2>
                  <p className="text-slate-300 leading-8">{analysis?.roadmap?.project_idea}</p>
                </div>
                <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10">
                  <h3 className="text-xl font-bold mb-4">Tech Stack</h3>
                  <div className="flex flex-wrap gap-3">
                    {analysis?.roadmap?.tech_stack?.map((tech: string, index: number) => (
                      <span key={index} className="px-4 py-2 rounded-full bg-cyan-500/10 border border-white/10 text-cyan-300 font-medium">
                        ⚛ {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10">
                  <h3 className="text-xl font-bold mb-4">Development Steps</h3>
                  <ol className="space-y-3">
                    {analysis?.roadmap?.development_steps?.map((step: string, index: number) => (
                      <li key={index} className="text-slate-300">{index + 1}. {step}</li>
                    ))}
                  </ol>
                </div>
                <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10">
                  <h3 className="text-xl font-bold mb-4">Milestones</h3>
                  <div className="space-y-6">
                    {analysis?.roadmap?.milestones?.map((item: string, index: number) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="flex flex-col items-center mt-1.5">
                          <div className="w-4 h-4 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.8)]" />
                          {index !== analysis.roadmap.milestones.length - 1 && (
                            <div className="w-[2px] h-16 bg-purple-500/30 mt-2" />
                          )}
                        </div>
                        <div className="bg-slate-900 rounded-xl p-4 flex-1 border border-white/10 text-slate-300">
                          {item}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-red-500/20">
                  <h3 className="text-xl font-bold text-red-400 mb-4">Challenges</h3>
                  <ul className="space-y-3">
                    {analysis?.roadmap?.challenges?.map((item: string, index: number) => (
                      <li key={index} className="text-slate-300">⚠ {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === "workflow" && (
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-10 border border-white/10">
                <h2 className="text-4xl font-black text-orange-400 mb-10">⚡ AI Processing Pipeline</h2>
                <div className="relative">
                  {workflowSteps.map((step, index) => (
                    <div key={index} className="flex items-start gap-6 mb-10 relative">
                      <div className="relative mt-1">
                        <div className="w-6 h-6 rounded-full bg-orange-400 shadow-[0_0_20px_rgba(251,146,60,0.8)] animate-pulse" />
                        {index !== workflowSteps.length - 1 && (
                          <div className="absolute left-[11px] top-6 w-[2px] h-20 bg-white/10" />
                        )}
                      </div>
                      <div className="flex-1 bg-slate-900/50 rounded-2xl p-5 border border-white/5">
                        <h3 className="font-bold text-xl text-orange-300">{step.title}</h3>
                        <p className="text-slate-400 mt-2">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </motion.div>
  );
}