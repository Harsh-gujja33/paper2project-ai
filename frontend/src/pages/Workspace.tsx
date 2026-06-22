import { useState } from "react";

function Workspace() {
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="min-h-screen bg-[#030712] text-white p-8">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-5xl font-black text-center mb-4">
          Paper2Project
        </h1>

        <p className="text-center text-slate-400 mb-12">
          Upload a research paper and let AI agents analyze it.
        </p>

        {/* Upload Card */}

        <div className="
          bg-white/5
          backdrop-blur-lg
          border
          border-cyan-500/20
          rounded-3xl
          p-10
        ">

          <div className="
            border-2
            border-dashed
            border-cyan-500/30
            rounded-3xl
            p-16
            text-center
          ">

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
              <p className="mt-6 text-cyan-400">
                {file.name}
              </p>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default Workspace;