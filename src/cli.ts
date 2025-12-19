#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import fs from "fs/promises";
import path from "path";
import readline from "readline/promises";
import { stdin as input, stdout as output } from "process";
import { createInteraction, generateContent, getInteraction } from "./api.js";

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

            // Step 1: Generate Plan
            const planSpinner = ora("Generating research plan...").start();
            let plan: string;
            try {
                // Use a standard Gemini model to quick-sketch a plan
                plan = await generateContent(`Create a detailed research plan for: "${topic}". 
          The plan should break down the research into key areas and questions. 
          Keep it concise but comprehensive enough for an autonomous agent.`);
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

            if (!interactionId) return;

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
                    }
                } catch (e: any) {
                    // Ignore transient errors
                }
            }

            // Step 4: Save Report
            if (finalReport) {
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
