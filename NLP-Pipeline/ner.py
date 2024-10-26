import pandas as pd
import spacy
import json
import random
from spacy.training.example import Example
from spacy.util import minibatch
from sklearn.model_selection import train_test_split
from tqdm import tqdm
import numpy as np
from pathlib import Path
import torch
import os
import subprocess
import sys

#### 1. System Checks and Setup
def check_system_requirements():
    """Check CUDA and system requirements"""
    print("\n=== System Requirements Check ===")
    
    # Check Python version
    print(f"Python version: {sys.version}")
    
    # Check CUDA availability
    print(f"CUDA available: {torch.cuda.is_available()}")
    if torch.cuda.is_available():
        print(f"CUDA version: {torch.version.cuda}")
        print(f"PyTorch version: {torch.__version__}")
        print(f"GPU device: {torch.cuda.get_device_name(0)}")
        
        # Get CUDA device properties
        device_props = torch.cuda.get_device_properties(0)
        print(f"GPU memory: {device_props.total_memory / 1024**3:.2f} GB")
        print(f"GPU compute capability: {device_props.major}.{device_props.minor}")
    
    # Check spaCy version
    print(f"spaCy version: {spacy.__version__}")
    
    # Try importing cupy
    try:
        import cupy
        print(f"CuPy version: {cupy.__version__}")
    except ImportError:
        print("CuPy not installed")
    
    print("===========================\n")

def setup_gpu():
    """Setup GPU environment"""
    try:
        if torch.cuda.is_available():
            n_gpu = torch.cuda.device_count()
            print(f"Found {n_gpu} GPU(s) available.")
            
            gpu_id = 0
            torch.cuda.set_device(gpu_id)
            os.environ['CUDA_VISIBLE_DEVICES'] = str(gpu_id)
            
            # Try importing cupy
            try:
                import cupy
                print("CuPy successfully imported")
            except ImportError:
                print("Warning: CuPy not found. Installing recommended version...")
                cuda_version = torch.version.cuda.split('.')
                major = cuda_version[0]
                minor = cuda_version[1]
                subprocess.check_call([sys.executable, "-m", "pip", "install", f"cupy-cuda{major}{minor}x"])
                import cupy
                print("CuPy installed successfully")
            
            print(f"Using GPU: {torch.cuda.get_device_name(gpu_id)}")
            return True
        else:
            print("No GPU available. Using CPU instead.")
            return False
    except Exception as e:
        print(f"Error setting up GPU: {e}")
        print("Falling back to CPU")
        return False

def manage_gpu_memory():
    """Manage GPU memory usage"""
    if torch.cuda.is_available():
        torch.cuda.empty_cache()
        # Use 80% of available GPU memory
        torch.cuda.set_per_process_memory_fraction(0.8)
        
        # Print current memory usage
        print("\nGPU Memory Usage:")
        print(f"Allocated: {torch.cuda.memory_allocated(0)/1024**3:.2f} GB")
        print(f"Cached: {torch.cuda.memory_reserved(0)/1024**3:.2f} GB")

#### 2. Data Loading and Preparation
def load_data():
    """Load and prepare the dataset"""
    try:
        df = pd.read_csv('data.csv')
        print(f"Loaded dataset with {len(df)} rows")
        return df
    except Exception as e:
        print(f"Error loading data: {e}")
        return None

def convert_to_prodigy_format(df):
    """Convert DataFrame to spaCy training format"""
    training_data = []
    skipped = 0
    
    for _, row in df.iterrows():
        text = row['User Input']
        concern = str(row['Extracted Concern'])
        
        if pd.isna(text) or pd.isna(concern) or concern.strip() == '':
            skipped += 1
            continue
            
        start_idx = text.lower().find(concern.lower())
        if start_idx != -1:
            end_idx = start_idx + len(concern)
            
            annotation = {
                "text": text,
                "entities": [(start_idx, end_idx, "CONCERN")]
            }
            training_data.append(annotation)
    
    print(f"Converted {len(training_data)} examples (skipped {skipped} invalid entries)")
    return training_data

#### 3. Model Training Functions
def create_training_examples(nlp, training_data):
    """Convert training data to spaCy Examples"""
    examples = []
    for annotation in training_data:
        text = annotation['text']
        entities = annotation['entities']
        doc = nlp.make_doc(text)
        example = Example.from_dict(doc, {"entities": entities})
        examples.append(example)
    return examples

def evaluate_model(nlp, test_data):
    """Evaluate model performance"""
    correct = 0
    total = 0
    
    for example in test_data:
        text = example['text']
        true_entities = set([(start, end, label) for start, end, label in example['entities']])
        
        doc = nlp(text)
        pred_entities = set([(ent.start_char, ent.end_char, ent.label_) for ent in doc.ents])
        
        correct += len(true_entities.intersection(pred_entities))
        total += len(true_entities)
    
    precision = correct / total if total > 0 else 0
    return precision

def train_model(training_data, validation_data, n_iter=30):
    """Train the NER model with GPU support"""
    use_gpu = setup_gpu()
    
    param_grid = {
        'dropout': [0.1, 0.2, 0.3],
        'batch_size': [4, 8, 16],
        'learning_rate': [0.001, 0.01, 0.1]
    }
    
    best_score = 0
    best_model = None
    best_params = None
    
    # Create config with GPU settings
    config = {
        "device": "gpu" if use_gpu else "cpu",
        "pipeline": {
            "ner": {
                "@architectures": "spacy.TransitionBasedParser.v2",
                "state_type": "ner",
                "extra_state_tokens": False,
                "hidden_width": 64,
                "maxout_pieces": 2,
                "use_upper": True
            }
        }
    }
    
    nlp = spacy.blank('en')
    if use_gpu:
        try:
            # Set GPU configuration
            spacy.prefer_gpu()
            nlp.config = config
            print("Training on GPU")
            manage_gpu_memory()
        except Exception as e:
            print(f"GPU setup failed: {e}")
            print("Falling back to CPU training")
            use_gpu = False
    
    for dropout in param_grid['dropout']:
        for batch_size in param_grid['batch_size']:
            for lr in param_grid['learning_rate']:
                print(f"\nTrying parameters: dropout={dropout}, batch_size={batch_size}, lr={lr}")
                
                nlp = spacy.blank('en')
                if use_gpu:
                    try:
                        spacy.require_gpu()
                    except Exception:
                        use_gpu = False
                
                if 'ner' not in nlp.pipe_names:
                    ner = nlp.add_pipe('ner')
                    ner.add_label('CONCERN')
                
                train_examples = create_training_examples(nlp, training_data)
                optimizer = nlp.initialize()
                
                # Training loop
                for iter in tqdm(range(n_iter), desc="Training"):
                    random.shuffle(train_examples)
                    losses = {}
                    
                    batches = minibatch(train_examples, size=batch_size)
                    for batch in batches:
                        nlp.update(
                            batch,
                            drop=dropout,
                            losses=losses,
                            sgd=optimizer
                        )
                    
                    if iter % 5 == 0:
                        print(f"Iteration {iter}, Losses:", losses)
                        if use_gpu:
                            manage_gpu_memory()
                
                score = evaluate_model(nlp, validation_data)
                print(f"Validation score: {score:.3f}")
                
                if score > best_score:
                    best_score = score
                    best_model = nlp
                    best_params = {
                        'dropout': dropout,
                        'batch_size': batch_size,
                        'learning_rate': lr
                    }
    
    return best_model, best_params, best_score

#### 4. Main Execution
def main():
    # Check system requirements
    check_system_requirements()
    
    # Setup GPU
    use_gpu = setup_gpu()
    
    # Load data
    print("Loading data...")
    df = load_data()
    if df is None:
        return None
    
    # Manage GPU memory
    if use_gpu:
        manage_gpu_memory()
    
    # Convert to spaCy format
    print("Converting data to spaCy format...")
    training_data = convert_to_prodigy_format(df)
    
    # Split data
    print("Splitting data into train and validation sets...")
    train_data, valid_data = train_test_split(training_data, test_size=0.2, random_state=42)
    
    # Train model
    print("Training model...")
    best_model, best_params, best_score = train_model(train_data, valid_data)
    
    # Save the model
    if best_model is not None:
        output_dir = Path("./model")
        if not output_dir.exists():
            output_dir.mkdir()
        best_model.to_disk(output_dir)
        print(f"\nModel saved to {output_dir}")
        print(f"Best parameters: {best_params}")
        print(f"Best validation score: {best_score:.3f}")
    
    return best_model

#### 5. Inference Function
def extract_concern(model, text):
    """Extract concerns from new text using the trained model"""
    doc = model(text)
    concerns = [(ent.text, ent.label_) for ent in doc.ents if ent.label_ == "CONCERN"]
    return concerns

#### 6. Model Loading Function
def load_trained_model(model_path="./model"):
    """Load a trained model from disk"""
    try:
        nlp = spacy.load(model_path)
        return nlp
    except Exception as e:
        print(f"Error loading model: {e}")
        return None

if __name__ == "__main__":
    # Train the model
    trained_model = main()
    
    # Example usage
    if trained_model is not None:
        # Test with a single example
        test_text = "I am constantly worried these days"
        concerns = extract_concern(trained_model, test_text)
        print("\nExample extraction:")
        print(f"Input text: {test_text}")
        print(f"Extracted concerns: {concerns}")
        
        # Test with multiple examples
        test_texts = [
            "I am constantly worried these days",
            "Feeling anxious about the upcoming presentation",
            "My sleep schedule is completely disrupted"
        ]
        
        print("\nMultiple examples:")
        for text in test_texts:
            concerns = extract_concern(trained_model, text)
            print(f"Input: {text}")
            print(f"Concerns: {concerns}\n")
