
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
