import os
import time
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
{text[:8000]}
"""

    for attempt in range(3):
        try:
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt
            )
            return response.text

        except Exception as e:
            print(f"Summary Attempt {attempt + 1} Failed:", e)
            
            if attempt < 2:
                time.sleep(10)

    return "Summary generation failed."