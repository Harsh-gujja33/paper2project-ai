from google import genai
from dotenv import load_dotenv
import os

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

def extract_innovations(text: str):

    prompt = f"""
    You are a research innovation analyst.

    Analyze this paper and provide:

    1. Main Innovation
    2. Novel Contributions
    3. Advantages Over Previous Approaches
    4. Research Impact

    Keep explanations simple.

    Paper:
    {text[:30000]}
    """

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    return response.text