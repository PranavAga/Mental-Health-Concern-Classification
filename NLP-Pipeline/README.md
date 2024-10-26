# Sentiment Analysis CLI Tool

A command-line tool that performs sentiment analysis on text input using DistilBERT model.

## Description

This tool analyzes the sentiment of input text and classifies it as either POSITIVE or NEGATIVE. It uses the DistilBERT model (specifically `distilbert-base-uncased-finetuned-sst-2-english`) and automatically selects the best available computing device (CUDA GPU, Apple Silicon MPS, or CPU).

## Requirements

- Python 3.6+
- PyTorch
- Transformers library

## Usage

Run the script from the command line with your text as an argument:

```py
    python sentiment-analysis.py "your text here"
```
