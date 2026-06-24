import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

def generate_complete_analysis(text: str):

    prompt = f"""
You are an expert Research Analyst and Software Architect.

Analyze the research paper and provide the following sections.

# Executive Summary

Provide a simple beginner-friendly summary.

# Problem Statement

What problem does this paper solve?

# Proposed Solution

Explain the approach.

# Key Findings

List the major findings.

# Real World Applications

Where can this be used?

# Main Innovation

What is the biggest innovation?

# Novel Contributions

List the contributions.

# Advantages Over Existing Methods

Compare with traditional approaches.

# Potential Impact

Explain future impact.

# Project Idea

Convert the paper into a project.

# Tech Stack

Recommend technologies.

# Development Steps

Step-by-step roadmap.

# Milestones

Important checkpoints.

# Challenges

Possible implementation challenges.

Research Paper:

{text}
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    return response.text