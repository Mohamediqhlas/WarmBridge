// ==== CONFIG ====
const MOCK_MODE = true; // set to false when you connect a real backend
const API_ENDPOINT = "https://your-backend-domain.com/api/warmbridge"; // for future use

// Conversation history (for future extension)
const history = [];

// ==== DOM ELEMENTS ====
const chatWindow = document.getElementById("chatWindow");
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const statusMessage = document.getElementById("statusMessage");
const modeIndicator = document.getElementById("modeIndicator");

// ==== INIT UI ====
function initWarmBridge() {
  modeIndicator.textContent = MOCK_MODE
    ? "Mode: Mock (no external API used)"
    : "Mode: Live API (via backend)";

  addAssistantMessage(
    "Hello. I am WarmBridge. I speak in simple steps to help with digital problems. " +
      "Tell me what is worrying you or what you need help with."
  );
}

document.addEventListener("DOMContentLoaded", initWarmBridge);

// ==== CHAT HELPERS ====

function addMessage(role, text) {
  const row = document.createElement("div");
  row.className = `message-row ${role}`;

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = text;

  row.appendChild(bubble);
  chatWindow.appendChild(row);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function addUserMessage(text) {
  addMessage("user", text);
}

function addAssistantMessage(text) {
  addMessage("assistant", text);
}

// ==== MOCK WARMBridge LOGIC (no LLM, just rule-based) ====

function mockWarmBridgeReply(userText) {
  const text = userText.toLowerCase();

  if (text.includes("bank") || text.includes("money") || text.includes("otp")) {
    return (
      "Step 1: Do not share your OTP, PIN or password with anyone.\n" +
      "Step 2: Read the message to me slowly, line by line.\n" +
      "Step 3: I will tell you if it looks safe or like a scam.\n" +
      "Step 4: If you are unsure, call the official bank number printed on your card or passbook."
    );
  }

  if (
    text.includes("doctor") ||
    text.includes("hospital") ||
    text.includes("health")
  ) {
    return (
      "Step 1: Tell me the name of the hospital or clinic.\n" +
      "Step 2: I will explain how to book the appointment in simple steps.\n" +
      "Step 3: Keep your ID card and any reports ready before you visit.\n" +
      "Step 4: If you feel very sick, go to the nearest clinic or hospital immediately."
    );
  }

  if (text.includes("form") || text.includes("application") || text.includes("document")) {
    return (
      "Step 1: Keep the form or document in your hand.\n" +
      "Step 2: Read or show me one line at a time.\n" +
      "Step 3: I will tell you in simple words what each part means.\n" +
      "Step 4: We will finish the form slowly, step by step, without hurry."
    );
  }

  if (
    text.includes("mobile") ||
    text.includes("phone") ||
    text.includes("app") ||
    text.includes("whatsapp")
  ) {
    return (
      "Step 1: Tell me what you see on your phone screen right now.\n" +
      "Step 2: I will tell you which button to tap first.\n" +
      "Step 3: We will move one step at a time.\n" +
      "Step 4: If you feel confused, stop and ask me again. It is okay."
    );
  }

  if (
    text.includes("scared") ||
    text.includes("tension") ||
    text.includes("stress") ||
    text.includes("worried")
  ) {
    return (
      "Step 1: Take a slow, deep breath.\n" +
      "Step 2: You are not alone. I am here to guide you.\n" +
      "Step 3: Tell me what is worrying you in one or two simple lines.\n" +
      "Step 4: We will handle it together, step by step."
    );
  }

  return (
    "Step 1: Tell me clearly what you need help with.\n" +
    "Step 2: I will explain it in very simple words.\n" +
    "Step 3: If it is a digital task, I will guide you button by button.\n" +
    "Step 4: If you do not understand, you can ask me the same thing again."
  );
}

// ==== REAL BACKEND CALL (for future, when you have an API) ====

async function callBackendWarmBridge(userText) {
  // This assumes you have a backend route like POST /api/warmbridge
  const response = await fetch(API_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
      // Do NOT send your API key from the frontend; keep it on backend only.
    },
    body: JSON.stringify({
      message: userText,
      history: history
    })
  });

  if (!response.ok) {
    throw new Error("Backend error: " + response.status);
  }

  const data = await response.json();
  return data.reply || "Sorry, I could not get a proper reply from the server.";
}

// ==== MAIN SEND HANDLER ====

chatForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const text = userInput.value.trim();
  if (!text) return;

  addUserMessage(text);
  userInput.value = "";
  statusMessage.textContent = "Thinking...";
  chatForm.querySelector("button").disabled = true;

  try {
    let reply;
    if (MOCK_MODE) {
      reply = mockWarmBridgeReply(text);
    } else {
      reply = await callBackendWarmBridge(text);
    }

    history.push({ role: "user", content: text });
    history.push({ role: "assistant", content: reply });

    addAssistantMessage(reply);
    statusMessage.textContent = "Ready.";
  } catch (err) {
    console.error(err);
    addAssistantMessage(
      "Sorry, I had a technical problem. Please try again in a moment."
    );
    statusMessage.textContent = "Error. Please try again.";
  } finally {
    chatForm.querySelector("button").disabled = false;
  }
});
