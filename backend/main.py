import os
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from agents.analysis_agent import generate_complete_analysis
from utils.pdf_parser import extract_text_from_pdf

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@app.get("/")
def home():
    return {"message": "Paper2Project Backend Running"}


@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):

    print("\n========== NEW REQUEST ==========")

    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    print("STEP 1: File Saved")

    paper_text = extract_text_from_pdf(file_path)

    print("STEP 2: PDF Parsed")
    print("TEXT LENGTH:", len(paper_text))

    try:
        print("Generating Complete Analysis...")

        analysis = generate_complete_analysis(
            paper_text[:8000]
        )

        print("Analysis Generated Successfully")

    except Exception as e:
        print("ANALYSIS FAILED:", e)
        # Directly interrupt processing and return a clean error object
        return {
            "error": str(e)
        }

    # Matches the exact flat root-key layout requested by your React state engine
    return {
        "filename": file.filename,
        "summary": analysis.get("summary", {}),
        "innovation": analysis.get("innovation", {}),
        "roadmap": analysis.get("roadmap", {})
    }