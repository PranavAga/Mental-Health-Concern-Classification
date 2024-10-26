from transformers import pipeline
import torch
import sys

class SentimentAnalyzer:
    def __init__(self):
        # Determine the best available device
        self.device = self._get_best_device()
        self.model_name = "distilbert-base-uncased-finetuned-sst-2-english"
        self.pipeline = self._initialize_model()

    def _get_best_device(self):
        """Determine the best available device for computation"""
        if torch.cuda.is_available():
            return 0  # Uses first CUDA device
        elif torch.backends.mps.is_available():
            return 'mps'
        else:
            return -1  # Uses CPU

    def _initialize_model(self):
        try:
            return pipeline(
                "sentiment-analysis",
                model=self.model_name,
                device=self.device
            )
        except Exception as e:
            print(f"Error loading DistilBERT: {e}")
            sys.exit(1)

    def analyze_text(self, text):
        """Analyze text and return uppercase label"""
        try:
            result = self.pipeline(text)[0]
            return result['label'].upper()
        except Exception as e:
            print(f"Error analyzing text: {e}")
            return "ERROR"

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python sentiment-analysis.py \"your text here\"")
        sys.exit(1)

    # Get input text from command line
    input_text = " ".join(sys.argv[1:])
    
    # Initialize analyzer
    analyzer = SentimentAnalyzer()
    
    # Get and print result
    result = analyzer.analyze_text(input_text)
    print(result)
