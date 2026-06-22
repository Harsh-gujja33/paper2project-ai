import os
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from agents.implementation_agent import generate_roadmap
from agents.innovation_agent import extract_innovations
from agents.summary_agent import summarize_paper
from utils.pdf_parser import extract_text_from_pdf

app = FastAPI()

# Permissive CORS Configuration for Testing/Debugging
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

    print("STEP 1: File received")

    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    print("STEP 2: File saved")

    paper_text = extract_text_from_pdf(file_path)

    print("STEP 3: PDF parsed")
    print("TEXT LENGTH:", len(paper_text))

    summary = "Test Summary"

    print("STEP 4: Summary generated")

    innovation =  "Test Innovation"

    print("STEP 5: Innovation generated")

    roadmap = "Test Roadmap"

    print("STEP 6: Roadmap generated")

    return {
        "filename": file.filename,
        "summary": summary,
        "innovation": innovation,
        "roadmap": roadmap,
    }