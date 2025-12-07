const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export const getGroqResponse = async (message, history = []) => {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;

    if (!apiKey) {
        throw new Error("Groq API Key is missing");
    }

    // Format history for Groq (OpenAI compatible)
    // History structure from App.jsx seems to be just array of strings [q1, q2..]
    // We need to convert it or just send current message if history structure is too simple.
    // For now, let's just send the current message + system prompt to keep it robust.

    const messages = [
        { role: "system", content: "You are a helpful, expert AI assistant. Answer usage questions concisely and beautifully formatted in Markdown." },
        ...history.map(msg => ({ role: "user", content: msg })), // Simplified history usage
        { role: "user", content: message }
    ];

    try {
        const response = await fetch(GROQ_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: messages,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`API Error: ${response.status} - ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        return data.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";
    } catch (error) {
        console.error("Groq API Error:", error);
        return "Error: Unable to fetch response from AI.";
    }
};
