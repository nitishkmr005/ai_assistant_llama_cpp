from flask import Flask, render_template, request, jsonify, Response, stream_with_context
from llama_cpp import Llama
import os
import json
import logging
import atexit

app = Flask(__name__)
logging.basicConfig(level=logging.DEBUG)

# Global models dictionary to store model instances
models = {}

def initialize_models():
    """Initialize models with proper error handling"""
    try:
        return {
            "Phi-4": Llama(
                model_path="models/phi-4-Q8_0.gguf",
                n_ctx=16384,
                n_threads=os.cpu_count(),
                n_batch=512,
                verbose=False,
                n_gpu_layers=-1
            ),
            "OpenHermes 2.5 Mistral": Llama(
                model_path="models/openhermes-2.5-mistral-7b.Q4_K_M.gguf",
                n_ctx=16384,
                n_threads=os.cpu_count(),
                n_batch=512,
                verbose=False,
                n_gpu_layers=-1
            ),
            "Qwen2.5 Coder": Llama(
                model_path="models/qwen2.5-coder-32b-instruct-q4_k_m-00001-of-00003.gguf",
                n_ctx=32768,  # Larger context for coding tasks
                n_threads=os.cpu_count(),
                n_batch=512,
                verbose=False,
                n_gpu_layers=-1
            )
        }
    except Exception as e:
        app.logger.error(f"Error initializing models: {e}")
        return {}

def cleanup_models():
    """Cleanup model resources properly"""
    for model_name, model in models.items():
        try:
            if model is not None:
                model.close()
        except Exception as e:
            app.logger.error(f"Error cleaning up model {model_name}: {e}")

# Initialize models on startup
models = initialize_models()

# Register cleanup function
atexit.register(cleanup_models)

# Default model
default_model = "Phi-4"

@app.route('/')
def home():
    app.logger.debug("Home route accessed")
    available_models = list(models.keys())
    app.logger.debug(f"Available models: {available_models}")
    if not models:
        return "Error: No models available", 500
    return render_template('index.html', models=available_models)

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    message = data.get('message', '')
    temperature = float(data.get('temperature', 0.7))
    selected_model = data.get('model', default_model)
    
    if selected_model not in models:
        return jsonify({"error": "Selected model not available"}), 400

    # Get the selected model
    llm = models[selected_model]
    
    def generate():
        # Adjust prompt based on model
        if selected_model == "OpenHermes 2.5 Mistral":
            prompt = f"<|im_start|>user\n{message}<|im_end|>\n<|im_start|>assistant\n"
        elif selected_model == "Qwen2.5 Coder":
            prompt = f"<|im_start|>user\n{message}<|im_end|>\n<|im_start|>assistant\n"
        else:
            prompt = f"You are a helpful AI assistant. User: {message}\nAssistant:"
        
        stream = llm(
            prompt,
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
    app.run(debug=True, host='0.0.0.0', port=5001) 