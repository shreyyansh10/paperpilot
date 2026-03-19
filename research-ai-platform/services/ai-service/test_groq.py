from dotenv import load_dotenv
import os
from openai import OpenAI

load_dotenv()

key = os.getenv('GROQ_API_KEY')
model = os.getenv('GROQ_MODEL', 'llama-3.3-70b-versatile')
base_url = os.getenv('GROQ_BASE_URL', 'https://api.groq.com/openai/v1')

print(f'Key last 6 chars: {key[-6:] if key else "NOT FOUND"}')
print(f'Model: {model}')
print(f'Base URL: {base_url}')

client = OpenAI(api_key=key, base_url=base_url)

response = client.chat.completions.create(
    model=model,
    messages=[
        {"role": "user", "content": "Say hello in one word"}
    ],
    max_tokens=10
)

print(f'Groq response: {response.choices[0].message.content}')
print('✅ Groq API is working!')
