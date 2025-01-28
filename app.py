from flask import Flask, render_template, request, jsonify, Response, stream_with_context
from llama_cpp import Llama
import os
import json

app = Flask(__name__)

# Initialize models
models = {
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
    )
}

# Default model
default_model = "Phi-4"

@app.route('/')
def home():
    available_models = list(models.keys())
    return render_template('index.html', models=available_models)

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    message = data.get('message', '')
    temperature = float(data.get('temperature', 0.7))
    selected_model = data.get('model', default_model)
    
    # Get the selected model
    llm = models[selected_model]
    
    def generate():
        # Adjust prompt based on model
        if selected_model == "OpenHermes 2.5 Mistral":
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
    app.run(debug=True) 