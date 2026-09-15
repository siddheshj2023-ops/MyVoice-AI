console.log("MYVOICE AI DASHBOARD LOADED");

const API = "http://127.0.0.1:3000";

const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const sendButton = document.getElementById("sendButton");
const clearButton = document.getElementById("clearBtn");

const textInput = document.getElementById("textInput");
const conversation = document.getElementById("conversation");
const emptyState = document.getElementById("emptyState");

const statusPill = document.getElementById("statusPill");
const statusTitle = document.getElementById("statusTitle");
const statusText = document.getElementById("statusText");

const commandCount = document.getElementById("commandCount");
const messageCount = document.getElementById("messageCount");
const successRate = document.getElementById("successRate");

const activityList = document.getElementById("activityList");

const autoSpeak = document.getElementById("autoSpeak");
const languageSelect = document.getElementById("languageSelect");

let recognition = null;
let busy = false;

let commands = Number(
  localStorage.getItem("myvoice_commands") || 0
);

let messages = Number(
  localStorage.getItem("myvoice_messages") || 0
);

let successes = Number(
  localStorage.getItem("myvoice_successes") || 0
);


// ============================================================
// STATS
// ============================================================

function syncStats() {
  if (commandCount) {
    commandCount.textContent = String(commands);
  }

  if (messageCount) {
    messageCount.textContent = String(messages);
  }

  const total = commands || 1;
  const percentage = Math.round((successes / total) * 100);

  if (successRate) {
    successRate.textContent = `${percentage}%`;
  }

  localStorage.setItem(
    "myvoice_commands",
    String(commands)
  );

  localStorage.setItem(
    "myvoice_messages",
    String(messages)
  );

  localStorage.setItem(
    "myvoice_successes",
    String(successes)
  );
}


// ============================================================
// STATE
// ============================================================

function setState(state, title, copy) {
  document.body.classList.remove(
    "listening",
    "thinking",
    "speaking"
  );

  if (state && state !== "ready") {
    document.body.classList.add(state);
  }

  if (statusPill) {
    statusPill.textContent =
      state === "ready"
        ? "READY"
        : state.toUpperCase();
  }

  if (statusTitle) {
    statusTitle.textContent = title;
  }

  if (statusText) {
    statusText.textContent = copy;
  }
}


// ============================================================
// CHAT BUBBLE
// ============================================================

function addBubble(kind, text) {
  if (!conversation) {
    return;
  }

  const oldEmptyState =
    document.getElementById("emptyState");

  if (oldEmptyState) {
    oldEmptyState.remove();
  }

  const wrap = document.createElement("div");
  wrap.className = `bubble ${kind}`;

  const avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.textContent =
    kind === "user"
      ? "You"
      : "✦";

  const body = document.createElement("div");
  body.className = "text";
  body.textContent = text;

  const meta = document.createElement("div");
  meta.className = "meta";

  meta.textContent =
    new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });

  body.appendChild(meta);
  wrap.appendChild(avatar);
  wrap.appendChild(body);

  conversation.appendChild(wrap);
  conversation.scrollTop =
    conversation.scrollHeight;
}


// ============================================================
// ACTIVITY
// ============================================================

function addActivity(text) {
  if (!activityList) {
    return;
  }

  const empty =
    activityList.querySelector(".activity-empty");

  if (empty) {
    activityList.innerHTML = "";
  }

  const item =
    document.createElement("div");

  item.className = "activity-item";

  const strong =
    document.createElement("strong");

  strong.textContent = text;

  const span =
    document.createElement("span");

  span.textContent =
    new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });

  item.appendChild(strong);
  item.appendChild(span);

  activityList.prepend(item);

  while (activityList.children.length > 8) {
    const last = activityList.lastElementChild;

    if (last) {
      last.remove();
    }
  }
}


// ============================================================
// BROWSER ACTIONS
// ============================================================

function executeBrowserAction(reply) {
  if (!reply) {
    return false;
  }

  if (reply === "OPEN_GOOGLE") {
    window.open(
      "https://www.google.com",
      "_blank",
      "noopener,noreferrer"
    );

    return true;
  }

  if (reply === "OPEN_YOUTUBE") {
    window.open(
      "https://www.youtube.com",
      "_blank",
      "noopener,noreferrer"
    );

    return true;
  }

  if (reply === "OPEN_CHATGPT") {
    window.open(
      "https://chatgpt.com",
      "_blank",
      "noopener,noreferrer"
    );

    return true;
  }

  if (reply === "OPEN_WEATHER") {
    window.open(
      "https://www.google.com/search?q=weather",
      "_blank",
      "noopener,noreferrer"
    );

    return true;
  }

  if (reply.indexOf("SEARCH_GOOGLE:") === 0) {
    const query = reply
      .substring("SEARCH_GOOGLE:".length)
      .trim();

    if (query) {
      window.open(
        "https://www.google.com/search?q=" +
          encodeURIComponent(query),
        "_blank",
        "noopener,noreferrer"
      );
    }

    return true;
  }

  return false;
}


// ============================================================
// TEXT TO SPEECH
// ============================================================

function speak(text) {
  if (
    !autoSpeak ||
    !autoSpeak.checked ||
    !("speechSynthesis" in window)
  ) {
    return;
  }

  window.speechSynthesis.cancel();

  const speech =
    new SpeechSynthesisUtterance(text);

  speech.lang =
    languageSelect
      ? languageSelect.value
      : "en-US";

  speech.rate = 1;
  speech.pitch = 1;

  speech.onstart = function () {
    setState(
      "speaking",
      "MyVoice is speaking",
      "Listen to the response, then ask another question."
    );
  };

  speech.onend = function () {
    setState(
      "ready",
      "Ask MyVoice anything",
      "Click the microphone and speak naturally."
    );
  };

  speech.onerror = function () {
    setState(
      "ready",
      "Speech finished",
      "Ready for your next command."
    );
  };

  window.speechSynthesis.speak(speech);
}


// ============================================================
// SEND MESSAGE
// ============================================================

async function sendMessage(message) {
  const text =
    String(message || "").trim();

  if (!text || busy) {
    return;
  }

  busy = true;

  commands += 1;
  messages += 1;

  addBubble("user", text);

  addActivity(
    `Command received: "${text}"`
  );

  syncStats();

  setState(
    "thinking",
    "MyVoice is thinking",
    "Processing your request..."
  );

  try {
    const response =
      await fetch(
        `${API}/api/message`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            message: text
          })
        }
      );

    if (!response.ok) {
      throw new Error(
        `Backend returned ${response.status}`
      );
    }

    const data =
      await response.json();

    const reply =
      String(
        data.reply ||
        "I could not generate a response."
      );

    const actionExecuted =
      executeBrowserAction(reply);

    let displayReply = reply;

    if (reply === "OPEN_GOOGLE") {
      displayReply =
        "Opening Google for you.";
    }

    else if (reply === "OPEN_YOUTUBE") {
      displayReply =
        "Opening YouTube for you.";
    }

    else if (reply === "OPEN_CHATGPT") {
      displayReply =
        "Opening ChatGPT for you.";
    }

    else if (reply === "OPEN_WEATHER") {
      displayReply =
        "Opening weather for you.";
    }

    else if (
      reply.indexOf("SEARCH_GOOGLE:") === 0
    ) {
      const query =
        reply
          .substring("SEARCH_GOOGLE:".length)
          .trim();

      displayReply =
        `Searching Google for "${query}".`;
    }

    addBubble(
      "ai",
      displayReply
    );

    if (actionExecuted) {
      addActivity(
        `Action executed: ${displayReply}`
      );
    }

    else {
      addActivity(
        `Assistant replied: "${displayReply}"`
      );
    }

    successes += 1;

    syncStats();

    speak(displayReply);

    if (
      !autoSpeak ||
      !autoSpeak.checked
    ) {
      setState(
        "ready",
        "Ask MyVoice anything",
        "Response ready. Start another command."
      );
    }

  }

  catch (error) {
    console.error(
      "MYVOICE ERROR:",
      error
    );

    addBubble(
      "ai",
      "I could not reach the MyVoice backend."
    );

    addActivity(
      "Backend connection failed"
    );

    setState(
      "ready",
      "Connection issue",
      "Make sure the backend is running on port 3000."
    );

    syncStats();
  }

  finally {
    busy = false;
  }
}


// ============================================================
// SPEECH RECOGNITION
// ============================================================

function setupRecognition() {
  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    setState(
      "ready",
      "Voice recognition unavailable",
      "Please use Google Chrome."
    );

    if (startButton) {
      startButton.disabled = true;
    }

    return;
  }

  recognition =
    new SpeechRecognition();

  recognition.lang =
    languageSelect
      ? languageSelect.value
      : "en-US";

  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onstart =
    function () {
      setState(
        "listening",
        "Listening...",
        "Speak clearly. I am waiting for your command."
      );
    };

  recognition.onresult =
    function (event) {
      const result =
        event.results[0];

      if (!result) {
        return;
      }

      const alternative =
        result[0];

      if (!alternative) {
        return;
      }

      const text =
        alternative.transcript.trim();

      if (text) {
        sendMessage(text);
      }
    };

  recognition.onerror =
    function (event) {
      console.error(
        "Speech recognition error:",
        event.error
      );

      addActivity(
        `Speech recognition error: ${event.error}`
      );

      setState(
        "ready",
        "Could not hear you",
        `Speech recognition error: ${event.error}`
      );
    };

  recognition.onend =
    function () {
      if (!busy) {
        setState(
          "ready",
          "Ask MyVoice anything",
          "Click the microphone and speak naturally."
        );
      }
    };
}


// ============================================================
// MICROPHONE BUTTON
// ============================================================

if (startButton) {
  startButton.addEventListener(
    "click",
    function () {
      if (!recognition) {
        setupRecognition();
      }

      if (!recognition) {
        return;
      }

      try {
        recognition.start();
      }

      catch (error) {
        console.warn(
          "Recognition could not start:",
          error
        );
      }
    }
  );
}


// ============================================================
// STOP BUTTON
// ============================================================

if (stopButton) {
  stopButton.addEventListener(
    "click",
    function () {
      if (recognition) {
        recognition.stop();
      }

      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }

      busy = false;

      setState(
        "ready",
        "Voice stopped",
        "Ready for the next command."
      );
    }
  );
}


// ============================================================
// SEND BUTTON
// ============================================================

if (sendButton) {
  sendButton.addEventListener(
    "click",
    function () {
      if (!textInput) {
        return;
      }

      const text =
        textInput.value;

      textInput.value = "";

      sendMessage(text);
    }
  );
}


// ============================================================
// ENTER KEY
// ============================================================

if (textInput) {
  textInput.addEventListener(
    "keydown",
    function (event) {
      if (event.key === "Enter") {
        event.preventDefault();

        if (sendButton) {
          sendButton.click();
        }
      }
    }
  );
}


// ============================================================
// QUICK COMMAND BUTTONS
// ============================================================

document
  .querySelectorAll(".command-btn")
  .forEach(function (button) {
    button.addEventListener(
      "click",
      function () {
        const command =
          button.dataset.command || "";

        sendMessage(command);
      }
    );
  });


// ============================================================
// NAVIGATION
// ============================================================

document
  .querySelectorAll(".nav-item")
  .forEach(function (button) {
    button.addEventListener(
      "click",
      function () {
        document
          .querySelectorAll(".nav-item")
          .forEach(function (item) {
            item.classList.remove("active");
          });

        button.classList.add("active");

        const panel =
          button.dataset.panel;

        const conversationPanel =
          document.getElementById(
            "conversationPanel"
          );

        const activityPanel =
          document.getElementById(
            "activityPanel"
          );

        const settingsPanel =
          document.getElementById(
            "settingsPanel"
          );

        if (conversationPanel) {
          conversationPanel.classList.toggle(
            "hidden",
            panel === "settings"
          );
        }

        if (activityPanel) {
          activityPanel.classList.toggle(
            "hidden",
            panel === "settings"
          );
        }

        if (settingsPanel) {
          settingsPanel.classList.toggle(
            "hidden",
            panel !== "settings"
          );
        }

        if (
          panel === "conversation" &&
          conversationPanel
        ) {
          conversationPanel.scrollIntoView({
            behavior: "smooth"
          });
        }

        if (
          panel === "activity" &&
          activityPanel
        ) {
          activityPanel.scrollIntoView({
            behavior: "smooth"
          });
        }
      }
    );
  });


// ============================================================
// CLEAR BUTTON
// ============================================================

if (clearButton) {
  clearButton.addEventListener(
    "click",
    function () {
      if (conversation) {
        conversation.innerHTML = `
          <div class="empty-state" id="emptyState">
            <div class="empty-icon">✦</div>
            <h4>Your conversation will appear here</h4>
            <p>
              Try "What time is it?",
              "Open YouTube",
              "Open ChatGPT",
              "Weather",
              or
              "Search artificial intelligence".
            </p>
          </div>
        `;
      }

      if (activityList) {
        activityList.innerHTML = `
          <div class="activity-empty">
            No activity yet.
          </div>
        `;
      }

      setState(
        "ready",
        "Ask MyVoice anything",
        "Conversation cleared. Ready for a fresh session."
      );
    }
  );
}


// ============================================================
// LANGUAGE CHANGE
// ============================================================

if (languageSelect) {
  languageSelect.addEventListener(
    "change",
    function () {
      if (recognition) {
        recognition.lang =
          languageSelect.value;
      }
    }
  );
}


// ============================================================
// INITIALIZATION
// ============================================================

syncStats();
setupRecognition();