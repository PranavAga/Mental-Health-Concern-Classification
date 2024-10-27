from validator import ConcernDetails
import google.generativeai as genai
import json
import os
from dotenv import load_dotenv


def analyze_mental_health(text):
    # Load environment variables from .env file
    load_dotenv()

    # Configure the API key
    GOOGLE_API_KEY = os.environ.get('GOOGLE_API_KEY')
    genai.configure(api_key=GOOGLE_API_KEY)

    # Initialize Gemini Pro
    model = genai.GenerativeModel('gemini-pro')

    # Create the prompt template
    prompt = f"""
    Analyze this text: "{text}"
    
    Respond with a JSON string containing exactly these fields:
    - "phrase": only the specific words indicating the mental health concern
    - "category": exactly one of: Anxiety, Career Confusion, Depression, Eating Disorder, Health Anxiety, Insomnia, Positive Outlook, Stress
    - "intensity": a number from 1-10 representing severity
    - "polarity": either "Positive", "Neutral", or "Negative"
    
    Example response format:
    {{"phrase": "can't sleep at night", "category": "Insomnia", "intensity": 7, "polarity": "Negative"}}
    """

    # Generate response and get the text content
    response = model.generate_content(prompt)
    response_text = response.text.strip()

    # Clean the response text (remove any markdown formatting if present)
    response_text = response_text.replace(
        '```json', '').replace('```', '').strip()

    try:
        # Parse the JSON response
        result = json.loads(response_text)
        return result
    except json.JSONDecodeError as e:
        return {
            "error": f"Failed to parse response: {str(e)}",
            "raw_response": response_text
        }
