const fs = require('fs');
const path = require('path');
const OpenAI = require("openai");

// Manually load .env.local
try {
    const envPath = path.resolve(__dirname, '../.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            process.env[key.trim()] = value.trim();
        }
    });
} catch (e) {
    console.warn("Could not load .env.local", e.message);
}

const apiKey = process.env.OPENROUTER_API_KEY;

if (!apiKey) {
    console.error("No API Key found into process environment or .env.local");
    process.exit(1);
}

console.log("Found API Key:", apiKey.substring(0, 10) + "...");

const client = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: apiKey,
});

async function test() {
    try {
        console.log("Testing OpenRouter API...");
        const response = await client.chat.completions.create({
            model: "deepseek/deepseek-chat",
            messages: [
                { role: "user", content: "Say 'Hello InternShield' if you can hear me." }
            ],
        });
        console.log("✅ Success! Response:");
        console.log(response.choices[0].message.content);
    } catch (error) {
        console.error("❌ Error:", error);
    }
}

test();
