from flask import Flask, render_template, request, jsonify, Response, stream_with_context
from llama_cpp import Llama
import os
import json

app = Flask(__name__)

# Initialize model
model_path = "models/phi-4-Q8_0.gguf"
llm = Llama(
    model_path=model_path,
    n_ctx=16384,  # Match model's training context length
    n_threads=os.cpu_count(),
    n_batch=512,
    verbose=False,
    n_gpu_layers=-1  # Use GPU for all layers if available
)

@app.route('/')
def home():
    available_models = ["Phi-4"]
    return render_template('index.html', models=available_models)

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    message = data.get('message', '')
    temperature = float(data.get('temperature', 0.7))
    
    def generate():
        stream = llm(
            f"You are a helpful AI assistant. User: {message}\nAssistant:",
            max_tokens=2048,
            temperature=temperature,
            stream=True,
            stop=None,
            echo=False
        )
        
        for chunk in stream:
            if chunk and 'choices' in chunk and len(chunk['choices']) > 0:
                text = chunk['choices'][0]['text']
                if text:
                    yield f"data: {json.dumps({'response': text})}\n\n"
    
    return Response(stream_with_context(generate()), 
                   mimetype='text/event-stream',
                   headers={'Cache-Control': 'no-cache', 
                           'X-Accel-Buffering': 'no'})

if __name__ == '__main__':
    app.run(debug=True) 