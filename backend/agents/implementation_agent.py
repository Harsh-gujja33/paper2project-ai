import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

def generate_roadmap(text: str):

    prompt = f"""
You are a senior software architect.

Convert this research paper into a practical software project.

Provide:

# Project Idea

# Recommended Tech Stack

# Architecture Overview

# Development Phases

Phase 1 - MVP
Phase 2 - Core Features
Phase 3 - Advanced Features

# Challenges

# Estimated Timeline

# Deployment Strategy

Research Paper:
{text[:30000]}
"""

    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=prompt
    )

    return response.text