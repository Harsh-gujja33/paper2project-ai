import os
from fastapi import FastAPI, File, UploadFile

from agents.innovation_agent import extract_innovations
from agents.summary_agent import summarize_paper
from utils.pdf_parser import extract_text_from_pdf

app = FastAPI()

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

    # 2. Extract key innovations from text
    innovation = extract_innovations(paper_text)

    # 3. Generate summary content
    summary = summarize_paper(paper_text)

    # 4. Return unified response data
    return {
        "filename": file.filename,
        "summary": summary,
        "innovation": innovation,
    }