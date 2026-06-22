import os
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from agents.implementation_agent import generate_roadmap
from agents.innovation_agent import extract_innovations
from agents.summary_agent import summarize_paper
from utils.pdf_parser import extract_text_from_pdf

app = FastAPI()

# Configure CORS Middleware for Frontend Communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
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

    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    # 1. Parse text from file
    paper_text = extract_text_from_pdf(file_path)

    # 2. Process content through agents
    summary = summarize_paper(paper_text)
    innovation = extract_innovations(paper_text)
    roadmap = generate_roadmap(paper_text)

    # 3. Return unified pipeline response
    return {
        "filename": file.filename,
        "summary": summary,
        "innovation": innovation,
        "roadmap": roadmap,
    }