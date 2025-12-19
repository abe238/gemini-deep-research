
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;
const BASE_URL = "https://generativelanguage.googleapis.com/v1beta/interactions";
export const DEEP_RESEARCH_AGENT = "deep-research-pro-preview-12-2025";

if (!API_KEY) {
    throw new Error("GEMINI_API_KEY is not set in .env file");
}

export interface InteractionResponse {
    name?: string; // Resource name, e.g. "interactions/..."
    id?: string;   // Interaction ID
    status?: string; // "in_progress", "completed", "failed"
    error?: any;
    outputs?: Array<{
        text: string;
    }>;
}

export async function createInteraction(input: string, agent: string = DEEP_RESEARCH_AGENT, background: boolean = true): Promise<InteractionResponse> {
    const url = `${BASE_URL}?key=${API_KEY}`;

    const body = {
        input,
        agent,
        background
    };

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to create interaction: ${response.status} ${response.statusText} - ${text}`);
    }

    return await response.json();
}

export async function generateContent(prompt: string, model: string = "gemini-3-flash-preview"): Promise<string> {
    const tryModel = async (modelName: string) => {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`;
        const body = {
            contents: [{ parts: [{ text: prompt }] }]
        };

        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Failed to generate content with ${modelName}: ${response.status} ${response.statusText} - ${text}`);
        }

        const data = await response.json();
        if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
            return data.candidates[0].content.parts[0].text;
        }
        throw new Error(`No content in response from ${modelName}`);
    };

    try {
        return await tryModel(model);
    } catch (e) {
        if (model === "gemini-3-flash-preview") {
            console.warn(`Fallback: ${model} failed, trying gemini-2.0-flash...`);
            return await tryModel("gemini-2.0-flash");
        }
        throw e;
    }
}



export async function getInteraction(interactionId: string): Promise<InteractionResponse> {
    // URL typically: https://generativelanguage.googleapis.com/v1beta/interactions/ID?key=...
    // Note: If interactionId is the full resource name (interactions/...), we can use it directly?
    // The docs say: GET .../interactions/INTERACTION_ID
    // My test script confirmed that `id` is returned as "v1_..." or similar, or a resource name. 
    // Wait, in my test script output (Step 47): "id": "v1_ChdV..."
    // So we invoke `${BASE_URL}/${interactionId}?key=${API_KEY}`.

    const url = `${BASE_URL}/${interactionId}?key=${API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to get interaction: ${response.status} ${response.statusText} - ${text}`);
    }

    return await response.json();
}
