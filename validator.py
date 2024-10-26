from pydantic import BaseModel
from typing import List

# Input model
class AnalysisInput(BaseModel):
    inputs: List[str]

# Output models
class ConcernDetails(BaseModel):
    concern: str
    category: str
    intensity: int

class AnalysisResult(BaseModel):
    polarity: str
    concerns: List[ConcernDetails]
    progression: str

class AnalysisResponse(BaseModel):
    results: List[AnalysisResult]
