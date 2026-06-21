from google import genai
from dotenv import load_dotenv
import os

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

def summarize_paper(text: str):

    prompt = f"""
    You are a research paper expert.

    Analyze the paper and provide:

    1. Executive Summary
    2. Problem Statement
    3. Proposed Solution
    4. Key Findings

    Keep the explanation simple and beginner-friendly.

    Research Paper:
    {text[:30000]}
    """

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    return response.text