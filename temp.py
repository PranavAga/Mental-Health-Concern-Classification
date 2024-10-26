from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Dict, Any
from random import choice, randint

app = FastAPI()

# Input model
class TextAnalysisInput(BaseModel):
    texts: List[str]

# Output models
class AnalysisDetail(BaseModel):
    concern: str
    category: str
    intensity: int

class AnalysisResult(BaseModel):
    polarity: str
    details: List[AnalysisDetail]
    timeline_shift: str

class AnalysisResponse(BaseModel):
    results: List[AnalysisResult]

# Sample categories and concerns for dummy data
categories = ["Finance", "Health", "Technology", "Education"]
concerns = ["Data Privacy", "User Experience", "Performance", "Security"]
polarities = ["positive", "neutral", "negative"]
timeline_shifts = ["stable", "increasing", "decreasing"]

@app.post("/analyze_texts", response_model=AnalysisResponse)
def analyze_texts(input_data: TextAnalysisInput):
    results = []
    for text in input_data.texts:
        # Generating dummy analysis
        polarity = choice(polarities)
        timeline_shift = choice(timeline_shifts)
        
        details = [
            AnalysisDetail(
                concern=choice(concerns),
                category=choice(categories),
                intensity=randint(1, 10)
            )
            for _ in range(randint(1, 3))  # Generate 1-3 concern details per text
        ]
        
        results.append(AnalysisResult(
            polarity=polarity,
            details=details,
            timeline_shift=timeline_shift
        ))

    return {"results": results}
