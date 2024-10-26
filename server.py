from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from validator import AnalysisInput, AnalysisResult
from call_models import getConcerns, getPolarity, getProgression

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

"""
Input Sequence:
Day 1: "I can’t sleep well and I feel very low."
Polarity: Negative
Extracted Concern 1: "can’t sleep well" → Category: "Insomnia" → Intensity: 6/10
Extracted Concern 2: "feel very low" → Category: "Depression" → Intensity: 7/10
Timeline Shift: Sentiment remains negative.
Day 7: "I feel a bit better but still anxious."
Polarity: Neutral
Extracted Concern 1: "still anxious" → Category: "Anxiety" → Intensity: 4/10
Timeline Shift: Signs of improvement from Depression to Anxiety.


{
  "inputs": [
    "I can’t sleep well and I feel very low.",
    "I feel a bit better but still anxious."
  ]
}

Output: {
    array of {
        polarity,
        array of {
            concern,
            category,
            intensity
        }

        progression
    }
}
"""
@app.post('/pipeline')
def mental_health_pipeline(input_data: AnalysisInput):
    results = []

    for user_input in input_data.inputs:
        polarity = getPolarity(user_input)

        concerns = getConcerns(user_input)

        progression = getProgression(results, polarity, concerns)

        results.append(AnalysisResult(
            polarity = polarity,
            concerns = concerns,
            progression = progression
        ))

    return {"results": results}

