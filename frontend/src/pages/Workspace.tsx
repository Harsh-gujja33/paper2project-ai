import { useState } from "react";
import api from "../services/api";

function Workspace() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");

  const handleUpload = async () => {
    if (!file) {
      alert("Please choose a PDF first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      console.log("UPLOAD STARTED");

      const response = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Handle the simplified single object payload or string representation
      if (typeof response.data.analysis === "object") {
        setSummary(JSON.stringify(response.data.analysis, null, 2));
      } else {
        setSummary(response.data.analysis || JSON.stringify(response.data, null, 2));
      }

    } catch (error: any) {
      console.error("FULL ERROR:", error);
      console.log("RESPONSE:", error.response);
      alert("Upload Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white p-8">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-5xl font-black text-center mb-4">
          Paper2Project
        </h1>

        <p className="text-center text-slate-400 mb-12">
          Upload a research paper and let AI agents analyze it.
        </p>

        {/* Upload Card */}

        <div className="bg-white/5 backdrop-blur-lg border border-cyan-500/20 rounded-3xl p-10">

          <div className="border-2 border-dashed border-cyan-500/30 rounded-3xl p-16 text-center">

            <div className="text-6xl mb-6">
              📄
            </div>

            <h2 className="text-3xl font-bold mb-4">
              Upload Research Paper
            </h2>

            <p className="text-slate-400 mb-8">
              Choose a PDF research paper to analyze.
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

        {/* Loading */}

        {loading && (
          <div className="text-center mt-12">

            <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />

            <p className="mt-6 text-slate-300">
              AI Agents are analyzing your paper...
            </p>

          </div>
        )}

        {/* Unified Results Card */}

        {!loading && summary && (
          <div className="mt-10 bg-white/5 p-8 rounded-3xl border border-cyan-500/20">
            <h2 className="text-3xl font-bold mb-6">
              📑 Complete Analysis
            </h2>

            <div className="whitespace-pre-wrap text-slate-300 font-mono text-sm leading-relaxed">
              {summary}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}

export default Workspace;