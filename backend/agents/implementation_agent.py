from google import genai
from dotenv import load_dotenv
import os

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

def generate_roadmap(text: str):

    prompt = f"""
    Convert this paper into a real project roadmap.

    Return:

    1. Project Idea
    2. Tech Stack
    3. Development Steps
    4. Milestones
    5. Challenges

    Paper:
    {text[:30000]}
    """

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    return response.text