function sendMessage() {
  const username = document.getElementById("username").value;
  const message = document.getElementById("message").value;
  fetch("/send", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `username=${encodeURIComponent(username)}&message=${encodeURIComponent(message)}`
  }).then(() => {
    document.getElementById("message").value = "";
    loadMessages();
  });
}

function loadMessages() {
  fetch("/messages")
    .then(response => response.json())
    .then(data => {
      const box = document.getElementById("chat-box");
      box.innerHTML = "";
      data.forEach(msg => {
        const p = document.createElement("p");
        p.textContent = `${msg.user}: ${msg.text}`;
        box.appendChild(p);
      });
    });
}

setInterval(loadMessages, 1000);
