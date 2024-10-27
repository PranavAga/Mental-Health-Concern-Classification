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
    "http://localhost:8000",
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

        # results.append(AnalysisResult(
        #     polarity = result["polarity"],
        #     concerns = [ConcernDetails(
        #         concern=result["phrase"],
        #         category=result["category"],
        #         intensity=str(result["intensity"])
        #     )
        #     ],
        #     progression = ""
        # ))

        results.append({
            "polarity": result.get("polarity","Neutral"),
            "concerns": [{
                "concern": result.get("phrase","-"),
                "category": result.get("category","Stress"),
                "intensity": result.get("intensity",5)
            }],
            "progression": ""
        })

    return {"results": results}


@app.put("/add_note/")
def add_note(note_input:NoteAddInput):
    print(note_input)
    note ={
        "title": note_input.title,
        "description": note_input.description,
        "time": note_input.time
    }
    result = collection.insert_one(note)
    print(result)

    if not result.inserted_id:
        raise HTTPException(status_code=500, detail="Failed to add note")
    
    return {"id": str(result.inserted_id)}

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

@app.put("/edit_note/{note_id}")
def edit_note(note_id: str, note_input:NoteAddInput):
    note ={
        "title": note_input.title,
        "description": note_input.description,
        "time": note_input.time
    }
    result = collection.update_one({"_id": ObjectId(note_id)}, {"$set": note})
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Note not found")
    return {"message": "Note updated successfully"}

def test_run():
    from pprint import pprint
    # view all notes
    pprint(get_all_notes())
    # add a note
    pprint(add_note(NoteAddInput(title="soham",description="soham: I am feeling very low today")))
    # view all notes
    pprint(get_all_notes())
    # delete a note
    noteid = input("Enter the note id to delete: ")
    pprint(delete_note(noteid))
    # view all notes
    pprint(get_all_notes())

if __name__ == "__main__":
    test_run()
