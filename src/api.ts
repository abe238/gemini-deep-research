
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

class ApiError extends Error {
    constructor(message: string, public status: number) {
        super(message);
        this.name = "ApiError";
    }
}

async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
    const headers = {
        "Content-Type": "application/json",
        "x-goog-api-key": API_KEY!,
        ...options.headers,
    };

    return fetch(url, { ...options, headers });
}

export async function createInteraction(input: string, agent: string = DEEP_RESEARCH_AGENT, background: boolean = true): Promise<InteractionResponse> {
    const body = {
        input,
        agent,
        background
    };

    const response = await fetchWithAuth(BASE_URL, {
        method: "POST",
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        const text = await response.text();
        throw new ApiError(`Failed to create interaction: ${response.status} ${response.statusText} - ${text}`, response.status);
    }

    return await response.json();
}

export async function generateContent(prompt: string, model: string = "gemini-3-flash-preview"): Promise<string> {
    const tryModel = async (modelName: string) => {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`;
        const body = {
            contents: [{ parts: [{ text: prompt }] }]
        };

        const response = await fetchWithAuth(url, {
            method: "POST",
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const text = await response.text();
            throw new ApiError(`Failed to generate content with ${modelName}: ${response.status} ${response.statusText} - ${text}`, response.status);
        }

        const data = await response.json();
        if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
            return data.candidates[0].content.parts[0].text;
        }
        throw new ApiError(`No content in response from ${modelName}`, 500);
    };

    try {
        return await tryModel(model);
    } catch (e: any) {
        if (model === "gemini-3-flash-preview" && (e.status === 404 || e.status >= 500)) {
            console.warn(`Fallback: ${model} failed, trying gemini-2.0-flash...`);
            return await tryModel("gemini-2.0-flash");
        }
        throw e;
    }
}

export async function getInteraction(interactionId: string): Promise<InteractionResponse> {
    // Check if interactionId is already a full resource name
    const finalId = interactionId.includes("/") ? interactionId.split("/").pop() : interactionId;
    const url = `${BASE_URL}/${finalId}`;

    const response = await fetchWithAuth(url);

    if (!response.ok) {
        const text = await response.text();
        throw new ApiError(`Failed to get interaction: ${response.status} ${response.statusText} - ${text}`, response.status);
    }

    return await response.json();
}
