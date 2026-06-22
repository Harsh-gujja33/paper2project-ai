import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

def extract_innovations(text: str):

    prompt = f"""
You are a startup strategist and innovation consultant.

Analyze the research paper and provide:

# Main Innovation
Explain the core innovation in simple language.

# Product Opportunities
List 3 products that can be built using this research.

# Startup Ideas
List 3 startup ideas with short descriptions.

# Market Potential
Explain who would use these products and why.

# Competitive Advantage
Explain what makes these ideas unique.

Research Paper:
{text[:30000]}
"""

    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=prompt
    )

    return response.text