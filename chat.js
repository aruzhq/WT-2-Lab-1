const chatForm = document.getElementById('chat-form');
const messageInput = document.getElementById('message-input');
const messagesDiv = document.getElementById('messages');

const userId = Date.now().toString();

const eventSource = new EventSource('/sse');

function appendMessage(message, isSelf) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('chat-message');

  if (isSelf) {
    messageElement.classList.add('self');
  } else {
    messageElement.classList.add('other');
  }

  messageElement.textContent = message.text;
  messagesDiv.appendChild(messageElement);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

eventSource.onmessage = function (event) {
  const message = JSON.parse(event.data);

  if (message.userId !== userId) {
    appendMessage(message, false);
  }
};

chatForm.addEventListener('submit', function (event) {
  event.preventDefault();
  const message = {
    text: messageInput.value,
    userId: userId
  };
  fetch('/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message)
  })
    .then(() => {
      appendMessage(message, true);
      messageInput.value = '';
    })
    .catch((error) => {
      console.error('Error sending the message:', error);
    });
});
