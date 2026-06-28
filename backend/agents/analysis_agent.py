import os
import json
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

def generate_complete_analysis(text: str):

    prompt = f"""
Analyze the research paper.

Return ONLY valid JSON.

{{
  "summary": {{
    "executive_summary": "",
    "problem_statement": "",
    "proposed_solution": "",
    "key_findings": []
  }},
  "innovation": {{
    "main_innovation": "",
    "novel_contributions": [],
    "advantages": [],
    "potential_impact": ""
  }},
  "roadmap": {{
    "project_idea": "",
    "tech_stack": [],
    "development_steps": [],
    "milestones": [],
    "challenges": []
  }}
}}

IMPORTANT:
- Use EXACTLY these keys.
- Do not change key names.
- key_findings must be array.
- advantages must be array.
- tech_stack must be array.
- development_steps must be array.
- milestones must be array.
- challenges must be array.

Research Paper:
{text}
"""

    # Leveraging configuration to enforce clean structured JSON outputs safely
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json"
        )
    )

    # Directly parse the response since response_mime_type guarantees standard JSON formatting strings
    return json.loads(response.text.strip())