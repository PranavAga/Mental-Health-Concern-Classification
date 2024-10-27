from pydantic import BaseModel
from typing import List
from typing import Optional
from datetime import datetime

# Input model
class AnalysisInput(BaseModel):
    inputs: List[str]

# Output models
class ConcernDetails(BaseModel):
    concern: str
    category: str
    intensity: str

class AnalysisResult(BaseModel):
    polarity: str
    concerns: List[ConcernDetails]
    progression: str

class AnalysisResponse(BaseModel):
    results: List[AnalysisResult]

class NoteAddInput(BaseModel):
    title: Optional[str] = None
    description: str
    time: Optional[str] = datetime.now().isoformat()
