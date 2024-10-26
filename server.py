import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from validator import AnalysisInput, AnalysisResult, NoteAddInput
from call_models import getConcerns, getPolarity, getProgression
from pymongo import MongoClient
from datetime import datetime
from bson import ObjectId
from dotenv import load_dotenv

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
@app.get("/")
def hello():
    return {"message":"hello"}

load_dotenv()  
# mongo_url = os.getenv('MONGO_URL')
mongo_url =  "mongodb+srv://pranavagarwal312:Fu5JMOZOgucm7VkS@cluster0.y2ufk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

client = MongoClient(mongo_url) 
db = client.note_db
collection = db.notes

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


@app.post("/notes/")
def add_note(note_input:NoteAddInput):
    print(note_input.note)
    result = collection.insert_one({
        "description": note_input.note,
        "time": datetime.now().isoformat()
    })
    print(result)

    if not result.inserted_id:
        raise HTTPException(status_code=500, detail="Failed to add note")
    
    return {'added': True}

@app.get("/notes/")
def get_all_notes():
    notes = []
    for note in collection.find():
        note["id"] = str(note["_id"])
        del note["_id"]
        notes.append(note)
    return notes

@app.delete("/notes/{note_id}")
def delete_note(note_id: str):
    result = collection.delete_one({"_id": ObjectId(note_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Note not found")
    return {"message": "Note deleted successfully"}
