const MarkdownIt = require('markdown-it');
const md = new MarkdownIt();
document.addEventListener('DOMContentLoaded', function() {
    const textInput = document.getElementById('text_user');
    const sendButton = document.getElementById('send_user_text');

    let isBotResponding = false;

    function checkInputAndToggleButton() {
        if (textInput.value.trim() === '' || isBotResponding) {
            sendButton.disabled = true;
            sendButton.style.opacity = '0.5';
        } else {
            sendButton.disabled = false;
            sendButton.style.opacity = '1'; 
        }
    }

    let messages = [];

    const newChatButton = document.getElementById('new_chat');

    newChatButton.addEventListener('click', function() {
        const chatBody = document.getElementById('chat_body');
        while (chatBody.firstChild) {
            chatBody.removeChild(chatBody.firstChild);
        }

        // Очищаем массив сообщений
        messages = [];

        // Обновляем состояние кнопки отправки
        checkInputAndToggleButton();
    });
    function createUserTextBlock(text) {
        isBotResponding = true; // Устанавливаем isBotResponding в true, пока бот не ответит
        checkInputAndToggleButton(); // Обновляем состояние кнопки отправки

        // Создаем div с id="user_text" внутри chat_body
        const userTextContainer = document.createElement('div');
        userTextContainer.id = 'user_text';
        userTextContainer.classList.add('message-animation'); // Добавляем класс
        document.getElementById('chat_body').appendChild(userTextContainer);
        

        // Создаем блок для изображения и имени пользователя
        const userInfoBlock = document.createElement('div');
        userInfoBlock.classList.add('user_text-one');

        const userImage = document.createElement('img');
        userImage.src = 'src/img/user.png';
        userInfoBlock.appendChild(userImage);

        const userName = document.createElement('p');
        userName.textContent = 'Вы';
        userInfoBlock.appendChild(userName);

        // Добавляем блок с информацией о пользователе в user_text
        userTextContainer.appendChild(userInfoBlock);
        
        const userRequest = document.createElement('p');
        userRequest.textContent = text; // Текст запроса

        userTextContainer.appendChild(userRequest);

        // Создаем кнопку с изображением
        const imageButton = document.createElement('button');
        imageButton.id = 'editButton'; // Добавляем id кнопке
        const buttonImage = document.createElement('img');
        buttonImage.src = 'src/img/pencil.png'; // Укажите путь к вашему изображению
        imageButton.appendChild(buttonImage);

        // Добавляем стили к кнопке
        imageButton.style.display = 'flex';
        imageButton.style.width = '50px';
        imageButton.style.background = 'none';
        imageButton.style.border = 'none';
        imageButton.style.cursor = 'pointer';

        // До��ав��яе�� стили к фото кнопки 
        buttonImage.style.height = '25px';

        // Добавляем кнопку в userTextContainer ����осле эл��мента userRequest
        userTextContainer.insertBefore(imageButton, userRequest.nextSibling);

        // Добавляем обработчик событий для кнопки
        imageButton.addEventListener('click', function() {
            // Вставляем текст запроса в поле ввода
            textInput.value = userRequest.textContent;
            // Активируем поле ввода
            textInput.focus();
        });

        // Добавляем сообщение пользователя в массив messages
        messages.push({
            role: "user",
            content: text
        });

        // Отправляем запрос на сервер
        fetch("https://nexra.aryahcr.cc/api/chat/gpt", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                messages: messages,
                prompt: text, // Используем текст запроса
                model: "GPT-4",
                markdown: false
            })
        }).then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text(); // Получаем текст ответа
            }).then((text) => {
                // Используем регулярное выражение для извлечения JSON из текста
                const jsonMatch = text.match(/{.*}/);
                if (!jsonMatch) {
                    throw new Error('Не удалось найти JSON в ответе');
                }
                const jsonString = jsonMatch[0];
                const data = JSON.parse(jsonString); // Преобразуем строку JSON в объект
                // Теперь data содержит объект JSON, из которого мы можем извлечь ответ GPT
                const gptResponseText = data.gpt; // Извлекаем текст ответа GPT
                const gptResponseHtml = md.render(gptResponseText);

                document.getElementById('chat_body').scrollIntoView({ behavior: 'smooth', block: 'end' });
                isBotResponding = false;
                checkInputAndToggleButton();
                // Создаем div с id="gpt_response" внутри chat_body
                const gptResponseContainer = document.createElement('div');
                gptResponseContainer.id = 'gpt_response';
                gptResponseContainer.classList.add('message-animation'); // Добавляем класс
                document.getElementById('chat_body').appendChild(gptResponseContainer);

                // Создаем блок для изображения и имени бота
                const botInfoBlock = document.createElement('div');
                botInfoBlock.classList.add('bot_text-one');

                const botImage = document.createElement('img');
                botImage.src = 'src/img/robot.png';
                botInfoBlock.appendChild(botImage);
                botImage.style.height = '40px'

                const botName = document.createElement('p');
                botName.textContent = 'ChatGPT 4';
                botInfoBlock.appendChild(botName);

                gptResponseContainer.appendChild(botInfoBlock);

                const botResponse = document.createElement('p');
                botResponse.innerHTML = gptResponseHtml; // Используем HTML ответа GPT

                gptResponseContainer.appendChild(botResponse);

                // Создание кнопки с изображением
                const gptButton = document.createElement('button');
                gptButton.id = 'gptButton'; // Уникальный ID для кнопки
                gptButton.style.display = 'flex';
                gptButton.style.width = '50px';
                gptButton.style.background = 'none';
                gptButton.style.border = 'none';
                gptButton.style.cursor = 'pointer';

                const buttonImage = document.createElement('img');
                buttonImage.src = 'src/img/content-copy.png';
                gptButton.appendChild(buttonImage);

                // Добавление кнопки напрямую в контейнер ответа GPT
                gptResponseContainer.appendChild(gptButton);

                // Добавление обработчика событий для кнопки
                gptButton.addEventListener('click', function() {
                    navigator.clipboard.writeText(gptResponseText).then(function() {
                        console.log('Текст успешно скопирован в буфер обмена');
                    }).catch(function(err) {
                        console.error('Не удалось скопировать текст: ', err);
                    });
                });

                // Добавляем ответ бота в массив messages
                messages.push({
                    role: "assistant",
                    content: gptResponseText // Используем текстовый ответ GPT
                });

                // Прокручиваем вниз контейнер чата после добавления нового сообще��и��
                document.getElementById('chat_body').scrollIntoView({ behavior: 'smooth', block: 'end' });
        }).catch((error) => {
            console.error('There has been a problem with your fetch operation:', error);
        }).catch((err) => {
            isBotResponding = false; // Устанавливаем isBotResponding обратно в false после получения ответа
            checkInputAndToggleButton(); // Обновляем состояние кнопки отправки
        });
    }
    
    sendButton.addEventListener('click', function() {
        if (!sendButton.disabled) {
            createUserTextBlock(textInput.value);
            textInput.value = ''; // Очистите поле ввода после отпр��вки
            checkInputAndToggleButton(); // Обновите состояние кно����ки отправки
        }
    });

    textInput.addEventListener('input', checkInputAndToggleButton);
    textInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Предотвращаем переход н�� новую строку в поле ввод��
            sendButton.click(); // Программно нажимаем кноп����у отпра��ки
        }
    });
    checkInputAndToggleButton();
});
