import google.generativeai as genai
import json

def analyze_mental_health(text):
    # Configure the API key
    GOOGLE_API_KEY = 'AIzaSyBopZmei607ybOI4o5tPuyiKoH5My993v4'
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
    
    Example response format:
    {{"phrase": "can't sleep at night", "category": "Insomnia", "intensity": 7}}
    """

    # Generate response and get the text content
    response = model.generate_content(prompt)
    response_text = response.text.strip()
    
    # Clean the response text (remove any markdown formatting if present)
    response_text = response_text.replace('```json', '').replace('```', '').strip()
    
    try:
        # Parse the JSON response
        result = json.loads(response_text)
        return result
    except json.JSONDecodeError as e:
        return {
            "error": f"Failed to parse response: {str(e)}",
            "raw_response": response_text
        }

    
result = analyze_mental_health("I'm trying, but I'm still constantly worried.")
print(result["category"])
