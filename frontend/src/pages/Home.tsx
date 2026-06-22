import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#030712] text-white overflow-hidden relative">

      {/* Glow Effects */}

      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-cyan-500/10 blur-[180px] rounded-full" />

      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-500/10 blur-[150px] rounded-full" />

      {/* Content */}

      <div className="min-h-screen flex flex-col items-center justify-center px-6 relative z-10">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-5xl"
        >

          <div className="mb-6 inline-block px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300">
            AI Agent Powered Research Analysis
          </div>

          <h1 className="text-7xl md:text-8xl font-black mb-6 tracking-tight">
            Paper2Project
          </h1>

          <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Transform research papers into
            <span className="text-cyan-400"> startup ideas</span>,
            <span className="text-emerald-400"> innovations</span>,
            and real-world implementation roadmaps.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/workspace")}
            className="
              mt-10
              px-10
              py-5
              rounded-2xl
              font-semibold
              text-lg
              bg-gradient-to-r
              from-cyan-500
              to-emerald-500
              shadow-lg
              shadow-cyan-500/20
            "
          >
            Start Building →
          </motion.button>

        </motion.div>

        {/* Feature Cards */}

        <div className="grid md:grid-cols-3 gap-6 mt-24 max-w-6xl w-full">

          <div className="bg-white/5 backdrop-blur-lg border border-cyan-500/20 rounded-3xl p-6">
            <h3 className="text-2xl font-bold mb-3">📄 Summary</h3>
            <p className="text-slate-400">
              Understand research papers quickly with AI-generated summaries.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-lg border border-emerald-500/20 rounded-3xl p-6">
            <h3 className="text-2xl font-bold mb-3">💡 Innovation</h3>
            <p className="text-slate-400">
              Discover product opportunities and unique ideas.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-lg border border-purple-500/20 rounded-3xl p-6">
            <h3 className="text-2xl font-bold mb-3">🛠 Roadmap</h3>
            <p className="text-slate-400">
              Get step-by-step implementation guidance.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Home;