const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

function normalizeText(text) {
    return String(text || "")
        .toLowerCase()
        .replace(/[?.,!]/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

function getCommand(message) {
    const text = normalizeText(message);

    if (
        text === "youtube" ||
        text.includes("open youtube") ||
        text.includes("go to youtube")
    ) {
        return "OPEN_YOUTUBE";
    }

    if (
    text === "chatgpt" ||
    text === "chat gpt" ||
    text.includes("open chatgpt") ||
    text.includes("open chat gpt") ||
    text.includes("go to chatgpt") ||
    text.includes("go to chat gpt") ||
    text.includes("launch chatgpt") ||
    text.includes("launch chat gpt") ||
    text.includes("start chatgpt") ||
    text.includes("start chat gpt") ||
    text.includes("open my chatgpt") ||
    text.includes("please open chatgpt") ||
    text.includes("please open chat gpt")
) {
    return "OPEN_CHATGPT";
}

    if (
        text === "google" ||
        text.includes("open google") ||
        text.includes("go to google")
    ) {
        return "OPEN_GOOGLE";
    }
if (
    text.includes("weather") ||
    text.includes("weather today") ||
    text.includes("todays weather") ||
    text.includes("what is the weather") ||
    text.includes("whats the weather") ||
    text.includes("how is the weather") ||
    text.includes("how's the weather") ||
    text.includes("current weather") ||
    text.includes("weather forecast") ||
    text.includes("forecast") ||
    text.includes("temperature") ||
    text.includes("temperature today") ||
    text.includes("what is the temperature") ||
    text.includes("how hot is it") ||
    text.includes("how cold is it")
) {
    return "OPEN_WEATHER";
}
   
   if (
    text === "time" ||
    text.includes("what time") ||
    text.includes("current time") ||
    text.includes("tell me the time") ||
    text.includes("what is the time") ||
    text.includes("whats the time") ||
    text.includes("what is todays time") ||
    text.includes("what's todays time") ||
    text.includes("todays time")
) {
    return "CURRENT_TIME";
}
    if (
        text === "date" ||
        text === "today" ||
        text.includes("what is the date") ||
        text.includes("what is today's date") ||
        text.includes("todays date")
    ) {
        return "CURRENT_DATE";
    }

    if (
        text.startsWith("search ") ||
        text.startsWith("search for ") ||
        text.startsWith("google search ")
    ) {
        return "SEARCH_GOOGLE";
    }

    return null;
}

app.get("/", (req, res) => {
    res.send("MYVOICE AI BACKEND IS WORKING");
});

app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        service: "MyVoice AI Backend",
        port: PORT
    });
});

app.post("/api/message", (req, res) => {
    try {
        const message = String(req.body?.message || "").trim();

        console.log("--------------------------------");
        console.log("USER MESSAGE:", message);

        if (!message) {
            return res.status(400).json({
                reply: "Please say something."
            });
        }

        const text = normalizeText(message);
        const command = getCommand(message);

        let reply;

        if (command === "OPEN_YOUTUBE") {
            reply = "OPEN_YOUTUBE";
        }

        else if (command === "OPEN_CHATGPT") {
            reply = "OPEN_CHATGPT";
        }

        else if (command === "OPEN_GOOGLE") {
            reply = "OPEN_GOOGLE";
        }

        else if (command === "OPEN_WEATHER") {
            reply = "OPEN_WEATHER";
        }

        else if (command === "CURRENT_TIME") {
            reply = "The current time is " +
                new Date().toLocaleTimeString("en-IN");
        }

        else if (command === "CURRENT_DATE") {
            reply = "Today's date is " +
                new Date().toLocaleDateString("en-IN");
        }

        else if (command === "SEARCH_GOOGLE") {
            let query = text;

            if (query.startsWith("google search ")) {
                query = query.slice("google search ".length).trim();
            }
            else if (query.startsWith("search for ")) {
                query = query.slice("search for ".length).trim();
            }
            else if (query.startsWith("search ")) {
                query = query.slice("search ".length).trim();
            }

            reply = query
                ? "SEARCH_GOOGLE:" + query
                : "Please tell me what you want me to search for.";
        }

        else if (
            text === "hello" ||
            text === "hi" ||
            text === "hey" ||
            text.includes("hello myvoice") ||
            text.includes("hi myvoice") ||
            text.includes("hey myvoice")
        ) {
            reply = "Hello! I am MyVoice. How can I help you?";
        }

        else if (text.includes("how are you")) {
            reply = "I am doing great! Thanks for asking.";
        }

        else if (
            text.includes("your name") ||
            text.includes("who are you")
        ) {
            reply =
                "My name is MyVoice. I am your personal AI voice assistant.";
        }

        else if (
            text.includes("thank you") ||
            text.includes("thanks")
        ) {
            reply = "You're welcome!";
        }

        else if (
            text === "bye" ||
            text === "goodbye" ||
            text.includes("good bye")
        ) {
            reply = "Goodbye! Have a great day.";
        }

        else if (
            text === "help" ||
            text.includes("what can you do") ||
            text.includes("commands")
        ) {
            reply =
                "I can open Google, YouTube and ChatGPT, check the time and date, search Google, and respond to basic questions.";
        }

        else {
            reply = "I heard you say: " + message;
        }

        console.log("MYVOICE REPLY:", reply);

        return res.json({ reply });

    } catch (err) {
        console.error("SERVER ERROR:", err);

        return res.status(500).json({
            reply: "Sorry, something went wrong."
        });
    }
});

app.use((req, res) => {
    res.status(404).json({
        error: "Route not found"
    });
});

app.listen(PORT, "127.0.0.1", () => {
    console.log("=================================");
    console.log("      MYVOICE AI BACKEND");
    console.log("=================================");
    console.log(`Server: http://127.0.0.1:${PORT}`);
    console.log(`Health: http://127.0.0.1:${PORT}/health`);
    console.log("=================================");
});