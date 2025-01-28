document.addEventListener('DOMContentLoaded', function() {
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const chatMessages = document.getElementById('chatMessages');
    const temperatureSlider = document.getElementById('temperatureSlider');
    const temperatureValue = document.getElementById('temperatureValue');

    // Initialize markdown-it
    const md = window.markdownit({
        highlight: function (str, lang) {
            if (lang && Prism.languages[lang]) {
                try {
                    return '<pre><code class="language-' + lang + '">' +
                           Prism.highlight(str, Prism.languages[lang], lang) +
                           '</code><button class="copy-button">Copy</button></pre>';
                } catch (__) {}
            }
            return '<pre><code class="language-' + lang + '">' +
                   md.utils.escapeHtml(str) +
                   '</code><button class="copy-button">Copy</button></pre>';
        }
    });

    // Function to add copy buttons to code blocks
    function setupCodeBlocks(element) {
        element.querySelectorAll('pre button.copy-button').forEach(button => {
            button.addEventListener('click', function() {
                const code = this.parentElement.querySelector('code');
                navigator.clipboard.writeText(code.textContent);
                
                // Show feedback
                const originalText = this.textContent;
                this.textContent = 'Copied!';
                setTimeout(() => {
                    this.textContent = originalText;
                }, 2000);
            });
        });
    }

    // Update temperature value display
    temperatureSlider.addEventListener('input', function() {
        temperatureValue.textContent = this.value;
    });

    function addMessage(message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'assistant-message'}`;
        messageDiv.textContent = isUser ? message : '';  // Only set text content for user messages
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return messageDiv;
    }

    async function sendMessage() {
        const message = messageInput.value.trim();
        if (!message) return;

        // Add user message to chat
        addMessage(message, true);
        messageInput.value = '';

        let currentMessage = document.createElement('div');
        currentMessage.className = 'message assistant-message';
        let markdownText = '';  // Store markdown text
        chatMessages.appendChild(currentMessage);

        const response = await fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                temperature: parseFloat(temperatureSlider.value)
            })
        }).then(response => {
            const reader = response.body.getReader();
            return new ReadableStream({
                start(controller) {
                    function push() {
                        reader.read().then(({done, value}) => {
                            if (done) {
                                controller.close();
                                return;
                            }
                            controller.enqueue(value);
                            const text = new TextDecoder().decode(value);
                            const lines = text.split('\n');
                            for (const line of lines) {
                                if (line.startsWith('data: ')) {
                                    try {
                                        const data = JSON.parse(line.slice(6));
                                        markdownText += data.response;
                                        currentMessage.innerHTML = md.render(markdownText);
                                        setupCodeBlocks(currentMessage);
                                        chatMessages.scrollTop = chatMessages.scrollHeight;
                                    } catch (e) {
                                        console.error('Error parsing JSON:', e);
                                    }
                                }
                            }
                            push();
                        });
                    }
                    push();
                }
            });
        });
    }

    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}); 