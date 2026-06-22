import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

def summarize_paper(text: str):

    prompt = f"""
You are a research paper expert.

Explain the paper in a beginner-friendly manner.

Provide:

# Executive Summary

# Problem Statement

# Proposed Solution

# Key Findings

# Real World Applications

# Why This Research Matters

Research Paper:
{text[:30000]}
"""

    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=prompt
    )

    return response.text