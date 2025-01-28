# AI Chat Assistant for open-source LLM models

A Flask-based chat application that uses local LLM models through llama-cpp-python. This application provides a ChatGPT-like interface for interacting with open-source language models.

## Features

- 🚀 Real-time streaming responses
- 💻 Code syntax highlighting
- 📋 Copy code functionality
- 🎨 ChatGPT-like UI
- 🔧 Adjustable temperature control
- 🔒 Fully local - no data sent to external services
- 📱 Responsive design

## Prerequisites

- Python 3.11 or higher
- pip (Python package installer)
- A GGUF format LLM model (e.g., Phi-2, Llama 2, Mistral)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-chat-assistant
```

2. Create and activate a virtual environment:
```bash
# On macOS/Linux
python3 -m venv local_env
source local_env/bin/activate

# On Windows
python -m venv local_env
.\local_env\Scripts\activate
```

3. Install the required packages:
```bash
pip install -r requirements.txt
```

4. Create a models directory and add your GGUF model:
```bash
mkdir models
# Place your .gguf model file in the models directory

# Download Phi-4 model
wget https://huggingface.co/TheBloke/phi-4-GGUF/resolve/main/phi-4-Q8_0.gguf -P models/

# Download OpenHermes 2.5 Mistral model
wget https://huggingface.co/TheBloke/OpenHermes-2.5-Mistral-7B-GGUF/resolve/main/openhermes-2.5-mistral-7b.Q4_K_M.gguf -P models/
```

## Configuration

1. Update the model path in `app.py`:
```python
model_path = "models/your-model-name.gguf"
```

2. Adjust model parameters if needed:
```python
llm = Llama(
    model_path=model_path,
    n_ctx=16384,  # Context window size
    n_threads=os.cpu_count(),
    n_batch=512,
    verbose=False,
    n_gpu_layers=-1  # Use GPU for all layers if available
)
```

## Running the Application

1. Start the Flask server:
```bash
python app.py
```

2. Open your browser and navigate to:
```
http://localhost:5000
```

## Data Privacy

This application:
- ✅ Runs completely locally
- ✅ No data sent to external servers
- ✅ No telemetry or tracking
- ✅ No external API calls
- ❌ No cloud dependencies

## Adding New Models

1. Download your GGUF model and place it in the `models` directory

2. Update the model configuration in `app.py`:
```python
# Update model path
model_path = "models/new-model.gguf"

# Update available models list
@app.route('/')
def home():
    available_models = ["Your Model Name"]  # Add your model name
    return render_template('index.html', models=available_models)
```

3. If using multiple models, you can modify the code to load different models:
```python
# Example of handling multiple models
models = {
    "Model1": Llama(model_path="models/model1.gguf", ...),
    "Model2": Llama(model_path="models/model2.gguf", ...)
}

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    selected_model = data.get('model', 'Model1')
    llm = models[selected_model]
    # Rest of the chat code...
```

## Project Structure

```
ai-chat-assistant/
├── static/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── main.js
├── templates/
│   └── index.html
├── models/
│   └── your-model.gguf
├── app.py
├── requirements.txt
└── README.md
```

## Troubleshooting

1. **Model Loading Issues**
   - Ensure your model is in GGUF format
   - Check if the model path is correct
   - Verify you have enough RAM for the model

2. **GPU Acceleration**
   - Install CUDA toolkit if using NVIDIA GPU
   - Set `n_gpu_layers=-1` for full GPU acceleration

3. **Memory Issues**
   - Adjust `n_ctx` parameter based on your system's RAM
   - Reduce `n_batch` if experiencing memory problems

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
