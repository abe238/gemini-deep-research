#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import readline from "readline/promises";
import { stdin as input, stdout as output } from "process";
import dotenv from "dotenv";

// --- API Logic ---

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

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

// --- CLI Logic ---

const program = new Command();

program
    .name("gemini-research")
    .description("CLI tool for Gemini Deep Research")
    .version("1.0.0")
    .argument("[topic]", "Topic to research")
    .option("-f, --file <path>", "Read topic from a file")
    .action(async (topic, options) => {
        try {
            // Priority 1: Read from file flag
            if (options.file) {
                try {
                    topic = await fs.readFile(path.resolve(process.cwd(), options.file), "utf-8");
                } catch (e: any) {
                    console.error(chalk.red(`Failed to read file: ${e.message}`));
                    process.exit(1);
                }
            }

            // Priority 2: Check for piped input (if no topic & not TTY)
            if (!topic && !input.isTTY) {
                const rl = readline.createInterface({ input, output: process.stdout, terminal: false });
                let data = "";
                for await (const line of rl) {
                    data += line + "\n";
                }
                topic = data.trim();
            }

            // Priority 3: Interactive Prompt
            if (!topic) {
                const rl = readline.createInterface({ input, output });
                console.log(chalk.blue("Enter research topic (press Enter to submit):"));
                console.log(chalk.dim("(For multi-line input, suggest using a file with -f)"));
                topic = await rl.question(chalk.hex('#FFD700')("> "));
                rl.close();
            }

            if (!topic || !topic.trim()) {
                console.log(chalk.red("No topic provided. Exiting."));
                return;
            }

            // Security: Sanitize input to remove potential control character attacks
            // while preserving valid multilingual and formatting characters.
            topic = topic.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");

            // Step 1: Generate Plan
            const planSpinner = ora("Generating research plan...").start();
            let plan: string;
            try {
                // Sanitize/Structure input to prevent basic prompt injection
                const safeTopic = topic.replace(/"/g, '\\"');
                const prompt = `Create a detailed research plan for: "${safeTopic}". 
          The plan should break down the research into key areas and questions. 
          Keep it concise but comprehensive enough for an autonomous agent.`;

                plan = await generateContent(prompt);
                planSpinner.succeed(chalk.green("Research Plan Generated:"));
            } catch (e: any) {
                planSpinner.fail(chalk.red("Failed to generate plan: " + e.message));
                console.log(chalk.yellow("Proceeding with raw topic..."));
                plan = topic;
            }

            console.log(chalk.gray("----------------------------------------"));
            console.log(plan);
            console.log(chalk.gray("----------------------------------------"));

            // Step 2: Confirm
            const rl = readline.createInterface({ input, output });
            const answer = await rl.question(chalk.yellow("Proceed with this research plan? (Y/n): "));
            rl.close();

            if (answer.toLowerCase() === "n") {
                console.log(chalk.blue("Aborted."));
                return;
            }

            // Step 3: Execute Research
            const startSpinner = ora("Initializing Deep Research Agent...").start();
            let interactionId: string | undefined;

            try {
                // Pass the refined plan to the Deep Research Agent
                const researchInput = `Execute the following research plan:\n\n${plan}`;
                const result = await createInteraction(researchInput);

                // Extract ID
                if (result.name) interactionId = result.name;
                else if (result.id) interactionId = result.id;

                if (!interactionId) {
                    throw new Error("No interaction ID returned");
                }
                startSpinner.succeed(chalk.green("Deep Research Agent started."));
                console.log(chalk.dim(`ID: ${interactionId}`));
            } catch (e: any) {
                startSpinner.fail(chalk.red("Failed to start research: " + e.message));
                return;
            }

            // Step 3: Poll
            const pollSpinner = ora("Researching (this may take 10+ minutes)...").start();
            let finalReport = "";
            const startTime = Date.now();
            const TIMEOUT_MS = 60 * 60 * 1000; // 1 hour timeout

            if (!interactionId) return;

            while (true) {
                // Check timeout
                if (Date.now() - startTime > TIMEOUT_MS) {
                    pollSpinner.fail(chalk.red("Research timed out after 60 minutes."));
                    break;
                }

                await new Promise(r => setTimeout(r, 10000)); // Poll every 10s

                try {
                    const statusData = await getInteraction(interactionId);

                    if (statusData.status === "completed" || statusData.status === "COMPLETED") {
                        if (statusData.outputs && statusData.outputs.length > 0) {
                            const lastOutput = statusData.outputs[statusData.outputs.length - 1];
                            if (lastOutput) {
                                finalReport = lastOutput.text;
                            }
                        }
                        pollSpinner.succeed(chalk.green("Research Completed!"));
                        break;
                    } else if (statusData.status === "failed" || statusData.status === "FAILED") {
                        pollSpinner.fail(chalk.red("Research Failed: " + JSON.stringify(statusData.error || "Unknown error")));
                        return;
                    }
                } catch (e: any) {
                    // Check for fatal errors (4xx) vs transient (5xx)
                    if (e.status && e.status >= 400 && e.status < 500) {
                        pollSpinner.fail(chalk.red(`Fatal API Error (${e.status}): ` + e.message));
                        return; // Stop polling on 4xx
                    }
                    // For others (network or 5xx), we retry
                    pollSpinner.text = `Researching (retrying after error: ${e.message})...`;
                }
            }

            // Step 4: Save Report
            if (finalReport) {
                const slug = topic.toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanum with dash
                    .replace(/^-+|-+$/g, "")     // Trim leading/trailing dashes
                    .substring(0, 50);           // Truncate

                const safeSlug = slug || "untitled-research";
                const filename = `report-${safeSlug}-${Date.now()}.md`;
                const filePath = path.join(process.cwd(), filename);

                await fs.writeFile(filePath, finalReport);
                console.log(chalk.green(`\nReport saved to: ${filename}`));
                console.log(chalk.gray("----------------------------------------"));
            } else if (Date.now() - startTime <= TIMEOUT_MS) {
                // Only showing warning if we didn't timeout
                console.log(chalk.yellow("No report content found."));
            }

        } catch (error: any) {
            console.error(chalk.red("Unexpected error:"), error.message);
            process.exit(1);
        }
    });

program.parse();
