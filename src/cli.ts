#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import fs from "fs/promises";
import path from "path";
import readline from "readline/promises";
import { stdin as input, stdout as output } from "process";
import { createInteraction, getInteraction } from "./api.js";

const program = new Command();

program
    .name("gemini-research")
    .description("CLI tool for Gemini Deep Research")
    .version("1.0.0")
    .argument("[topic]", "Topic to research")
    .action(async (topic) => {
        try {
            if (!topic) {
                const rl = readline.createInterface({ input, output });
                topic = await rl.question(chalk.blue("Enter research topic: "));
                rl.close();
            }

            if (!topic) {
                console.log(chalk.red("No topic provided. Exiting."));
                return;
            }

            // Step 1: Execute Research
            const startSpinner = ora("Initializing Deep Research Agent...").start();
            let interactionId: string | undefined;

            try {
                const researchInput = `Research topic: "${topic}".\n\nCreate a research plan and then execute it comprehensively.`;
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

            // Step 4: Poll
            const pollSpinner = ora("Researching (this may take 10+ minutes)...").start();
            let finalReport = "";

            if (!interactionId) return; // Should not happen

            while (true) {
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
                    } else {
                        // Update spinner text optionally?
                        // pollSpinner.text = `Researching... Status: ${statusData.status}`;
                    }
                } catch (e: any) {
                    // If polling fails transiently, just log and continue
                    // But if it's permanent, we might loop forever. 
                    // For now, assume transient network issues shouldn't crash it.
                    // console.error(chalk.red("Polling error: " + e.message));
                }
            }

            // Step 5: Save Report
            if (finalReport) {
                // Sanitize filename: remove non-alphanumeric/dash, collapse dashes, trim
                const slug = topic.toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanum with dash
                    .replace(/^-+|-+$/g, "")     // Trim leading/trailing dashes
                    .substring(0, 50);           // Truncate
                const filename = `report-${slug}-${Date.now()}.md`;
                const filePath = path.join(process.cwd(), filename);

                await fs.writeFile(filePath, finalReport);
                console.log(chalk.green(`\nReport saved to: ${filename}`));
                console.log(chalk.gray("----------------------------------------"));
            } else {
                console.log(chalk.yellow("No report content found."));
            }

        } catch (error: any) {
            console.error(chalk.red("Unexpected error:"), error.message);
            process.exit(1);
        }
    });

program.parse();
