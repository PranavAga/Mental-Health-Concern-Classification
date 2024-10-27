import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from validator import AnalysisInput, AnalysisResult, NoteAddInput, ConcernDetails
from call_models import analyze_mental_health
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
mongo_url = os.getenv('MONGO_URL')

client = MongoClient(mongo_url) 
db = client.note_db
collection = db.notes

"""
{
  "inputs": [
    "I can’t sleep well",
    "I feel a bit better but still anxious."
  ]
}

Output: {
    array of {
        polarity,
        [{
            concern,
            category,
            intensity
        }]

        progression
    }
}
"""
@app.post('/pipeline')
def mental_health_pipeline(input_data: AnalysisInput):
    results = []

    for user_input in input_data.inputs:
        result = analyze_mental_health(user_input)

        results.append(AnalysisResult(
            polarity = "Neutral",
            concerns = [ConcernDetails(
                concern=result["phrase"],
                category=result["category"],
                intensity=str(result["intensity"])
            )
            ],
            progression = ""
        ))

    return {"results": results}


@app.post("/notes")
def add_note(note_input:NoteAddInput):
    print(note_input)
    print(note_input.note)
    result = collection.insert_one({
        "description": note_input.note,
        "time": datetime.now().isoformat()
    })
    print(result)

    if not result.inserted_id:
        raise HTTPException(status_code=500, detail="Failed to add note")
    
    return {"id": str(result.inserted_id), "description": note_input.note,
        "time": datetime.now().isoformat()}

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
