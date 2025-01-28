document.addEventListener('DOMContentLoaded', function() {
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const chatMessages = document.getElementById('chatMessages');
    const temperatureSlider = document.getElementById('temperatureSlider');
    const temperatureValue = document.getElementById('temperatureValue');
    const modelSelect = document.getElementById('modelSelect');
    const welcomeContainer = document.querySelector('.welcome-container');
    const stopButton = document.getElementById('stopButton');

    // Controller for aborting fetch requests
    let abortController = null;

    // Auto-resize textarea
    function autoResize(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    }

    messageInput.addEventListener('input', function() {
        autoResize(this);
    });

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
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.textContent = isUser ? message : '';
        messageDiv.appendChild(contentDiv);
        
        // Add edit button for user messages
        if (isUser) {
            const editButton = document.createElement('button');
            editButton.className = 'edit-button';
            editButton.textContent = 'Edit';
            editButton.onclick = () => startEditing(messageDiv, message);
            messageDiv.appendChild(editButton);
        }
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return contentDiv;
    }

    // Function to handle message editing
    function startEditing(messageDiv, originalText) {
        messageDiv.classList.add('editing');
        
        // Create edit input
        const editInput = document.createElement('textarea');
        editInput.className = 'edit-input';
        editInput.value = originalText;
        
        // Auto-resize the edit input
        editInput.style.height = 'auto';
        editInput.style.height = editInput.scrollHeight + 'px';
        editInput.addEventListener('input', () => autoResize(editInput));
        
        // Handle edit submission
        editInput.addEventListener('keydown', async (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const newText = editInput.value.trim();
                if (newText && newText !== originalText) {
                    // Remove all following messages
                    let nextNode = messageDiv.nextSibling;
                    while (nextNode) {
                        const toRemove = nextNode;
                        nextNode = nextNode.nextSibling;
                        toRemove.remove();
                    }
                    
                    // Update message content
                    messageDiv.querySelector('.message-content').textContent = newText;
                    
                    // Generate new response
                    messageDiv.classList.remove('editing');
                    editInput.remove();
                    
                    // Send edited message through main send function
                    await sendMessage(newText);
                } else {
                    // If no changes or empty, just remove editing state
                    messageDiv.classList.remove('editing');
                    editInput.remove();
                }
            } else if (e.key === 'Escape') {
                // Cancel editing on Escape
                messageDiv.classList.remove('editing');
                editInput.remove();
            }
        });
        
        messageDiv.appendChild(editInput);
        editInput.focus();
    }

    // Hide welcome screen when starting chat
    function hideWelcomeScreen() {
        if (welcomeContainer) {
            welcomeContainer.style.display = 'none';
        }
    }

    async function sendMessage(message = null) {
        const messageText = message || messageInput.value.trim();
        if (!messageText) return;

        // Show stop button
        stopButton.style.display = 'flex';
        sendButton.style.display = 'none';

        // Hide welcome screen on first message
        hideWelcomeScreen();

        // Add user message to chat
        addMessage(messageText, true);
        if (!message) messageInput.value = '';

        let currentMessage = document.createElement('div');
        currentMessage.className = 'message assistant-message';
        let contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        currentMessage.appendChild(contentDiv);
        let markdownText = '';
        chatMessages.appendChild(currentMessage);

        // Create new abort controller
        abortController = new AbortController();

        const response = await fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: messageText,
                temperature: parseFloat(temperatureSlider.value),
                model: modelSelect.value
            }),
            signal: abortController.signal
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
                                        contentDiv.innerHTML = md.render(markdownText);
                                        setupCodeBlocks(contentDiv);
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
        }).finally(() => {
            // Hide stop button when done
            stopButton.style.display = 'none';
            sendButton.style.display = 'flex';
        });
    }

    // Function to stop generation
    function stopGeneration() {
        if (abortController) {
            abortController.abort();
            abortController = null;
        }
        stopButton.style.display = 'none';
        sendButton.style.display = 'flex';
    }

    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    stopButton.addEventListener('click', stopGeneration);
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}); 