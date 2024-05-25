const { gpt } = require("gpti");

document.addEventListener('DOMContentLoaded', function() {
    const textInput = document.getElementById('text_user');
    const sendButton = document.getElementById('send_user_text');
    const chatBody = document.getElementById('chat_body');
    let isBotResponding = false;
    let messages = [];

    function checkInputAndToggleButton() {
        if (textInput.value.trim() === '' || isBotResponding) {
            sendButton.disabled = true;
            sendButton.style.opacity = '0.5';
        } else {
            sendButton.disabled = false;
            sendButton.style.opacity = '1';
        }
    }

    function clearChat() {
        while (chatBody.firstChild) {
            chatBody.removeChild(chatBody.firstChild);
        }
        messages = [];
        checkInputAndToggleButton();
    }

    function createUserTextBlock(text) {
        isBotResponding = true;
        checkInputAndToggleButton();

        const userTextContainer = document.createElement('div');
        userTextContainer.id = 'user_text';
        userTextContainer.classList.add('message-animation');
        chatBody.appendChild(userTextContainer);

        const userRequest = document.createElement('p');
        userRequest.textContent = text;
        userTextContainer.appendChild(userRequest);


        messages.push({ role: "user", content: text });

        gpt.v1({
            messages: messages,
            prompt: text,
            model: "gpt-3.5-turbo",
            markdown: true,
        }, (err, data) => {
            if (err) {
                console.error(err);
                alert("Error processing your request. Please try again.");
                isBotResponding = false;
                checkInputAndToggleButton();
            } else {
                const gptotvet = data.gpt;
                insertBingResponseHtml(gptotvet);
                messages.push({ role: "assistant", content: gptotvet });
                isBotResponding = false;
                checkInputAndToggleButton();
            }
        });
    }

    function insertBingResponseHtml(responseText) {
        const bingResponseContainer = document.createElement('div');
        bingResponseContainer.id = 'gpt_response';
        bingResponseContainer.classList.add('message-animation');
        chatBody.appendChild(bingResponseContainer);
    
        bingResponseContainer.innerHTML = responseText;
    
        scrollChatToBottom();
    }
    
    
    function scrollChatToBottom() {
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    const newChatButton = document.getElementById('new_chat');
    newChatButton.addEventListener('click', clearChat);

    sendButton.addEventListener('click', function() {
        if (!sendButton.disabled) {
            createUserTextBlock(textInput.value);
            textInput.value = '';
            checkInputAndToggleButton();
        }
    });

    textInput.addEventListener('input', checkInputAndToggleButton);
    textInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendButton.click();
        }
    });

    checkInputAndToggleButton();
});