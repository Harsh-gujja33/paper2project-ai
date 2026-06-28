import { useState } from "react";
import api from "../services/api";
import Dashboard from "../components/Dashboard";

function Workspace() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 1: Clean unified analysis payload state hook variable instance configuration
  const [analysis, setAnalysis] = useState<any>(null);

  const handleUpload = async () => {
    if (!file) {
      alert("Please choose a PDF first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setError("");
      setAnalysis(null);

      console.log("UPLOAD STARTED");

      const response = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = response.data;

      if (data.error) {
        setError(data.error);
        return;
      }

      // Reconstructed state formatting to pull flat fields into grouped properties
      if (data.summary) {
        console.log(data);

        setAnalysis({
          summary: data.summary,
          innovation: data.innovation,
          roadmap: data.roadmap,
        });
      }

    } catch (err: any) {
      console.error("FULL ERROR:", err);
      console.log("RESPONSE:", err.response);
      setError("Upload Failed. Please check your network connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  // Condition view interceptor rendering the dashboard component if analysis data exists
  if (analysis) {
    return <Dashboard analysis={analysis} />;
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white p-8">

      <div className="max-w-7xl mx-auto">

        {/* Replaced Header Block: Production Grade Hero Header Area */}
        <div className="text-center mb-16">

          <div className="inline-block px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-sm mb-6">
            AI Powered Research Analyzer
          </div>

          <h1
            className="
            text-6xl
            md:text-7xl
            font-black
            leading-tight
            bg-gradient-to-r
            from-cyan-400
            via-blue-500
            to-purple-500
            bg-clip-text
            text-transparent
            mb-6
          "
          >
            Transform Research Papers
            <br />
            Into Real Projects
          </h1>

          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Upload any research paper and instantly generate
            executive summaries, innovation insights,
            implementation roadmaps, and production-ready
            project ideas.
          </p>

        </div>

        {/* Upload Card */}
        <div
          className="
          bg-slate-900/60
          backdrop-blur-xl
          border
          border-cyan-500/20
          rounded-3xl
          p-10
          shadow-[0_0_50px_rgba(6,182,212,0.1)]
        "
        >

          <div className="border-2 border-dashed border-cyan-500/30 rounded-3xl p-16 text-center">

            <div className="text-7xl mb-6">
              📚
            </div>

            <h2 className="text-4xl font-bold mb-4">
              Upload Research Paper
            </h2>

            <p className="text-slate-400 mb-8">
              Drag & drop your PDF or browse files.
              AI agents will generate insights instantly.
            </p>

            <input
              id="pdf-upload"
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setFile(e.target.files[0]);
                }
              }}
            />

            <label
              htmlFor="pdf-upload"
              className="
                cursor-pointer
                inline-block
                px-8
                py-4
                rounded-2xl
                bg-gradient-to-r
                from-cyan-500
                to-emerald-500
                font-semibold
              "
            >
              Choose PDF
            </label>

            {file && (
              <div className="mt-6">
                <p className="text-cyan-400 mb-4">
                  {file.name}
                </p>

                <button
                  onClick={handleUpload}
                  className="
                    px-8
                    py-3
                    rounded-xl
                    bg-gradient-to-r
                    from-purple-500
                    to-cyan-500
                    font-semibold
                  "
                >
                  Upload & Analyze
                </button>
              </div>
            )}

          </div>

        </div>

        {/* Dedicated Inline Error Display Card */}
        {error && (
          <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 flex items-center gap-3">
            <span>❌</span>
            <div className="text-sm font-medium">{error}</div>
          </div>
        )}

        {/* Loading Spinner Area */}
        {loading && (
          <div className="text-center mt-12">

            <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />

            <div className="mt-8 space-y-3 text-slate-300">
              <p>✅ PDF Uploaded</p>
              <p>✅ Extracting Text</p>
              <p>✅ Understanding Research</p>
              <p>⏳ Generating Insights</p>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}

export default Workspace;