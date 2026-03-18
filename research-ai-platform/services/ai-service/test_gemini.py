from dotenv import load_dotenv
import os
from google import genai

load_dotenv()

api_key = os.getenv('GEMINI_API_KEY')
model = os.getenv('GEMINI_MODEL', 'gemini-2.5-flash')

print(f"Using model: {model}")
print(f"Key last 6 chars: {api_key[-6:] if api_key else 'NOT FOUND'}")

client = genai.Client(api_key=api_key)
response = client.models.generate_content(
    model=model,
    contents='Say hello in one word'
)
print('Gemini response:', response.text)