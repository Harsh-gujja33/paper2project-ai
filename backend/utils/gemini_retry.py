import time

def generate_with_retry(client, prompt, retries=5):

    for attempt in range(retries):

        try:
            response = client.models.generate_content(
                model="gemini-2.0-flash",
                contents=prompt
            )

            return response.text

        except Exception as e:

            print(f"Attempt {attempt+1} failed:", e)

            if attempt < retries - 1:
                time.sleep(10)

    return "Gemini service unavailable. Please try again later."