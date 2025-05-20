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

function clearMessages() {
  fetch("/clear", {
    method: "POST"
  }).then(response => response.json())
    .then(data => {
      if (data.success) {
        loadMessages();
      } else {
        alert("Ошибка при очистке сообщений");
      }
    });
}


let userAgent;
let session;

function initSIP() {
  userAgent = new SIP.UA({
    uri: 'sip:username@sip.example.com', 
    transportOptions: {
      wsServers: ['wss://sip-ws.example.com'] 
    },
    authorizationUser: 'username',
    password: 'password',
  });

  userAgent.on('invite', (incomingSession) => {
    if (session) {
      incomingSession.reject();
    } else {
      session = incomingSession;
      session.accept({
        media: {
          constraints: { audio: true, video: false },
          render: {
            remote: document.getElementById('remoteAudio')
          }
        }
      });
      session.on('terminated', () => {
        session = null;
      });
    }
  });
}

function makeCall() {
  if (session) {
    alert('Уже есть активный звонок');
    return;
  }
  const callee = document.getElementById('callee').value;
  session = userAgent.invite(callee, {
    media: {
      constraints: { audio: true, video: false },
      render: {
        remote: document.getElementById('remoteAudio')
      }
    }
  });
  session.on('terminated', () => {
    session = null;
  });
}

function hangUp() {
  if (session) {
    session.bye();
    session = null;
  }
}

window.onload = () => {
  initSIP();
  loadMessages();
  setInterval(loadMessages, 1000);
}


setInterval(loadMessages, 1000);
