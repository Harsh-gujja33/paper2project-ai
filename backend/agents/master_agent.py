import os
import json
from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

def analyze_paper(text: str):

    prompt = f"""
You are an expert research analyst.

Analyze the following research paper and return ONLY valid JSON.

Format:

{{
  "summary": {{
    "executive_summary": "",
    "problem_statement": "",
    "proposed_solution": "",
    "key_findings": ""
  }},
  "innovation": {{
    "main_innovation": "",
    "novel_contributions": "",
    "advantages": "",
    "potential_impact": ""
  }},
  "roadmap": {{
    "project_idea": "",
    "tech_stack": "",
    "development_steps": "",
    "milestones": "",
    "challenges": ""
  }}
}}

Research Paper:

{text}
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    return json.loads(response.text)