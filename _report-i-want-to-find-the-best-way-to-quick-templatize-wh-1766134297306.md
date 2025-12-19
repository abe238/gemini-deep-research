# Comprehensive Analysis of Automated Configuration and Templating for AI Coding Agents (November 2025)

## Executive Summary

As of November 2025, the landscape of AI-assisted software development has shifted from ad-hoc configuration to standardized, interoperable protocols. The primary mechanism for configuring agent behavior has converged on the **`AGENTS.md`** standard, a machine-readable manifesto that serves as a "README for robots." While proprietary formats like `CLAUDE.md` (for Anthropic's Claude Code) and `.cursorrules` (for Cursor) remain in use, the industry—led by the newly formed Agentic AI Foundation (AAIF)—is moving toward unified specifications.

For developers seeking to "quick templatize" these configurations through interactive means (answering questions to generate infrastructure), two primary tools have emerged as the gold standard: **GitHub Spec Kit** (via the `specify-cli`) and **Agent Rules Kit** (`agent-rules-kit`). GitHub Spec Kit introduces "Spec-Driven Development" (SDD), using interactive slash commands to generate project "constitutions" and plans. Conversely, Agent Rules Kit utilizes a CLI questionnaire to scaffold stack-specific rules for multiple IDEs simultaneously.

The most effective workflow identified for late 2025 involves a hybrid approach: using **Agent Rules Kit** to bootstrap the initial technical constraints and **GitHub Spec Kit** to manage the ongoing project lifecycle and functional specifications. To bridge the gap between the emerging `AGENTS.md` standard and Claude Code's native requirements, the use of symbolic links or the **Ruler** tool is the recommended best practice.

## 1. Introduction: The Standardization of Agent Context

The rapid proliferation of AI coding agents in 2024 and 2025 created a fragmentation crisis. Developers found themselves maintaining duplicate context files across different tools—`CLAUDE.md` for Anthropic's CLI, `.cursorrules` for Cursor, and `.github/copilot-instructions.md` for GitHub Copilot [cite: 1, 2]. By November 2025, a concerted industry effort to unify these configurations culminated in the widespread adoption of `AGENTS.md` and the formation of the Agentic AI Foundation [cite: 3].

### 1.1 The Shift from Vibe Coding to Spec-Driven Development
Early AI adoption was characterized by "vibe coding"—spontaneous, unstructured prompting that often led to "over-engineered" or inconsistent results [cite: 4, 5]. The introduction of tools like GitHub Spec Kit marked a paradigm shift toward Spec-Driven Development (SDD). In this model, the agent configuration is not just a static list of rules but a dynamic, interactive set of specifications (Specs), plans, and tasks [cite: 6, 7].

### 1.2 The Role of Configuration Files
The configuration files in question (`AGENTS.md`, `CLAUDE.md`) serve as the long-term memory and operational constraints for the agent. They typically contain:
*   **Project Overview:** High-level architectural goals.
*   **Tech Stack:** Specific versions and libraries (e.g., "Use PyTorch 2.1, not TensorFlow").
*   **Conventions:** Coding style, naming conventions, and directory structure.
*   **Operational Commands:** How to build, test, and deploy the application [cite: 8, 9].

## 2. The `AGENTS.md` Standard vs. `CLAUDE.md`

Understanding the relationship between these two file types is critical before selecting a templating tool.

### 2.1 `AGENTS.md`: The Industry Standard
By late 2025, `AGENTS.md` established itself as the vendor-neutral standard, supported by OpenAI, Google, and eventually recognized by the Linux Foundation's AAIF [cite: 3, 10]. It functions as a unified source of truth.
*   **Adoption:** Over 60,000 open-source projects adopted this standard by the end of 2025 [cite: 11].
*   **Structure:** It is a Markdown file located at the repository root, often supplemented by nested `AGENTS.md` files in subdirectories for monorepos [cite: 8, 12].

### 2.2 `CLAUDE.md`: The Native Format
Anthropic's Claude Code CLI natively looks for `CLAUDE.md` to load context into its context window [cite: 13, 14]. While Claude Code is highly capable, it does not strictly adhere to `AGENTS.md` by default without configuration.
*   **The Interoperability Gap:** To use a single source of truth, developers must bridge these formats.
*   **The Symlink Solution:** The prevailing best practice in November 2025 is to create the master configuration in `AGENTS.md` and create a symbolic link named `CLAUDE.md` pointing to it (`ln -s AGENTS.md CLAUDE.md`) [cite: 1, 15, 16]. Alternatively, one can use the import syntax `@AGENTS.md` inside a `CLAUDE.md` file [cite: 16].

## 3. Interactive Templating Tools (The "Questions Answered" Approach)

To address the user's request for tools that "quick templatize" these files based on "questions answered," research identifies three primary categories of tools active in November 2025.

### 3.1 GitHub Spec Kit (`specify-cli`)
**Status:** Active, High Relevance (Released/Updated Sept-Nov 2025)
**Primary Function:** Spec-Driven Development Scaffolding

GitHub Spec Kit is arguably the most sophisticated tool for this purpose. It does not merely generate a static rule file; it scaffolds an entire interaction model between the developer and the agent.

*   **Interactive Mechanism:**
    The tool uses a CLI (`specify-cli`) to initialize the project. It asks the user to select the AI assistant (e.g., Claude, Copilot, Gemini) and the shell type [cite: 17].
    *   **Command:** `uv tool install specify-cli --from git+https://github.com/github/spec-kit.git` followed by `specify init` [cite: 7].
    *   **The "Questions":** Once initialized, the user interacts with the agent using slash commands.
        *   `/speckit.constitution`: The user answers prompts to establish project principles (the "Constitution"), which functions similarly to `AGENTS.md` or `CLAUDE.md` by setting non-negotiable rules [cite: 7, 18].
        *   `/speckit.specify`: The user answers questions about *what* they are building.
        *   `/speckit.plan`: The user answers questions about *how* it should be built (tech stack) [cite: 18].

*   **Output:**
    It generates a `.specify` directory containing templates and a `constitution.md` file. It also configures the agent-specific folders (e.g., `.claude/commands/` or `.github/agents/`) to ensure the agent understands the workflow [cite: 18, 19].

*   **Why it fits the query:** It explicitly "scaffolds" the setup needed to configure a project and uses an interactive process to define the "constitution" (rules) of the project.

### 3.2 Agent Rules Kit (`agent-rules-kit`)
**Status:** Active, High Relevance
**Primary Function:** Multi-IDE Rule Generation via Questionnaire

For developers who want a pure "Q&A to Config File" experience, **Agent Rules Kit** is the most direct solution. It is designed specifically to bootstrap `AGENTS.md`, `.cursorrules`, and `CLAUDE.md` simultaneously.

*   **Interactive Mechanism:**
    The tool runs an interactive CLI questionnaire.
    *   **Command:** `npx agent-rules-kit` [cite: 20, 21].
    *   **The Questions:**
        1.  **Project Path:** Where is the project?
        2.  **IDE Selection:** Which agents are you using? (Cursor, VS Code, Claude, Windsurf).
        3.  **Stack Selection:** What is the technology? (e.g., Laravel, Next.js, Python).
        4.  **Architecture:** What is the design pattern?
        5.  **MCP Tools:** Which Model Context Protocol tools should be enabled? [cite: 20].

*   **Output:**
    It generates optimized rule files for the selected platforms. If "Claude" is selected, it generates the appropriate configuration to ensure Claude Code adheres to the project's constraints. It supports the `AGENTS.md` standard and can mirror documentation for human readability [cite: 20].

*   **Why it fits the query:** It is a "one-shot" generator that creates the exact files requested (`agents.md`, `claude.md` equivalents) by asking specific infrastructure questions.

### 3.3 Ruler (`intellectronica/ruler`)
**Status:** Active, Maintenance/Management Focus
**Primary Function:** Centralized Rule Distribution

While Spec Kit and Agent Rules Kit *create* the content, **Ruler** is the tool used to *manage* and *distribute* it, particularly when multiple agents are involved.

*   **Mechanism:**
    Ruler uses a central `.ruler/` directory. It does not necessarily "ask questions" to generate the content in the same way as the kits above, but it is the essential "setup needed to configure a project" for multi-agent environments [cite: 22, 23].
*   **Configuration:**
    Users define rules in `.ruler/` and use `ruler.toml` to specify which agents receive which rules.
*   **Command:** `ruler apply` automatically syncs the central rules to `CLAUDE.md`, `.cursorrules`, etc. [cite: 24, 25].

## 4. Detailed Execution Plan for Templating

Based on the research, the following is the comprehensive execution plan to "quick templatize" a development environment in November 2025.

### Phase 1: Bootstrapping with Agent Rules Kit
To immediately generate the baseline `AGENTS.md` and `CLAUDE.md` files based on your infrastructure:

1.  **Install and Run:**
    Execute `npx agent-rules-kit` in your terminal.
2.  **Answer the Interactive Prompts:**
    *   *Select Stack:* Choose your specific framework (e.g., React, Django). This ensures the generated `AGENTS.md` contains correct build/test commands.
    *   *Select IDEs:* Select both "Claude" and "Cursor" (or others) to ensure cross-compatibility.
    *   *Select MCP Tools:* Choose tools like `filesystem` or `github` if your agent needs them.
3.  **Result:** This will create a robust, stack-aware `AGENTS.md` and the necessary vendor-specific files or symlinks [cite: 20, 21].

### Phase 2: Implementing Spec-Driven Workflow with GitHub Spec Kit
To configure the project for ongoing development and deep context (the "Constitution"):

1.  **Initialize Spec Kit:**
    Run `uv tool install specify-cli --from git+https://github.com/github/spec-kit.git` followed by `specify init` [cite: 7].
2.  **Define the Constitution:**
    Run the agent command `/speckit.constitution`. The agent will ask you questions about your coding principles, security requirements, and testing standards.
3.  **Result:** This generates `.specify/memory/constitution.md`.
4.  **Integration:** You should reference this constitution in your `AGENTS.md` or `CLAUDE.md` (e.g., "Read project principles from `.specify/memory/constitution.md`") to ensure the agent adheres to these high-level rules during every session [cite: 17, 18].

### Phase 3: Claude-Specific Optimization (The "Skill Creator")
For advanced Claude Code setups, you can use Claude's internal "Skill Creator" to generate specialized workflows.

1.  **Action:** Open Claude Code and ask: "Use the skill-creator to help me build a skill for [task]."
2.  **Interaction:** Answer the interactive questions about the workflow.
3.  **Result:** Claude generates a `SKILL.md` file (with YAML frontmatter) that acts as a specialized sub-agent configuration [cite: 26, 27].

## 5. Comparative Analysis of Tools (November 2025)

| Feature | **GitHub Spec Kit** | **Agent Rules Kit** | **Ruler** | **Better Agents CLI** |
| :--- | :--- | :--- | :--- | :--- |
| **Primary Goal** | Spec-Driven Development (SDD) | Rule Generation (Scaffolding) | Rule Synchronization | Production Agent Scaffolding |
| **Interactive Mode** | Slash Commands (`/specify`) | CLI Questionnaire | Config File (`ruler.toml`) | CLI Init (`npx better-agents`) |
| **Generates `AGENTS.md`** | Indirectly (via Constitution) | **Yes (Directly)** | Distributes it | Yes |
| **Generates `CLAUDE.md`** | Yes (via templates) | **Yes (Optimized)** | Syncs to it | Yes |
| **Best For...** | Ongoing development workflow | **Initial project setup** | Maintaining multi-agent repos | Building custom agents |
| **Key Source** | [cite: 7, 19] | [cite: 20] | [cite: 22] | [cite: 28] |

## 6. Best Practices for Project Configuration

Research from late 2025 highlights several critical best practices when creating these templates:

1.  **The Symlink Strategy:**
    Do not maintain separate `AGENTS.md` and `CLAUDE.md` files with different content. Create `AGENTS.md` as the master and symlink `CLAUDE.md` to it. This ensures that when you update your rules, Claude Code immediately sees the changes [cite: 15, 16, 29].
    *   *Command:* `ln -s AGENTS.md CLAUDE.md`

2.  **Progressive Disclosure:**
    Do not stuff every possible rule into the main `AGENTS.md`. Use a "Progressive Disclosure" strategy. The main file should contain high-level context and pointers to specific documentation (e.g., `@docs/testing.md`). This prevents context window bloating and confusion [cite: 14].

3.  **Monorepo Nesting:**
    If working in a monorepo, place a general `AGENTS.md` at the root and specific `AGENTS.md` files in subdirectories (e.g., `/frontend/AGENTS.md`). Agents like Claude Code and Cursor are designed to read the nearest configuration file or merge them [cite: 1, 8].

4.  **Model Context Protocol (MCP):**
    Ensure your setup includes an `.mcp.json` file if you are using external tools. Both Spec Kit and Agent Rules Kit support configuring this. This allows the agent to know which tools (like database access or web search) are available [cite: 9, 30].

## 7. Conclusion

To "quick templatize" your agent configuration in November 2025, the most efficient path is to use **Agent Rules Kit** (`npx agent-rules-kit`) for the initial file generation. This tool directly answers your need for a "questions answered" approach to creating `AGENTS.md` and `CLAUDE.md`. For a more robust, ongoing development lifecycle, this should be paired with **GitHub Spec Kit**, which provides the interactive "Spec-Driven" workflow that keeps the agent's context (its "Constitution") updated as the project evolves.

By adopting the **`AGENTS.md`** standard and using these scaffolding tools, developers can ensure their projects are future-proofed for the rapidly expanding ecosystem of the Agentic AI Foundation.

## 8. References
*   **GitHub Spec Kit:** [cite: 7, 18, 19]
*   **Agent Rules Kit:** [cite: 20, 21]
*   **AGENTS.md Standard:** [cite: 1, 8, 10, 31]
*   **Ruler:** [cite: 22, 23]
*   **Claude Code Best Practices:** [cite: 9, 13, 14]
*   **Agentic AI Foundation:** [cite: 3, 11]

**Sources:**
1. [kupczynski.info](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHyeXoov9dO2r5ofF_-2wGAu3V9g_3XkFinTzSXxHRN60Ksrp7poq9dne5pkbsiua1Q-2M9mke1aectUunhgD6JUzy4jRCsQWBYVYBTGGz3nXdz0FiFHf-yw89fJq6TeAVbgw1t_XrVbt9w1eO0QrItgww9QwVbWdfzI1LpbWY=)
2. [dev.to](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQFqSxlEbuZYgoYN2eukMRkigdOhO9GLtSyQCbpeAGuGCWexgHyNBJUZ4UTmuQXUIbJbgB-sH-qV_k3wPj2lYrJAlJ3eLTtjpxYDwosddSnxruYEOKXXXdRzilqd8Eh8LU0nrcBtjMM4GZ4iwF4Lgunrl-7SrknD7xXmQqY=)
3. [linuxfoundation.org](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQG6EBH0CuuBAdeu7yq6ayTL2VYTbGLOVLfQ1-B990YdJVI4IHZXrk4pil1amOrbY4QMi5M5sPPtAKgOwCzNK91qVfFJc3OTG9ob_HFQjabg8N7qS0O0i8j5KPBMT_cFI4QpoEgQhfkdmDsZjU9J91TJTgyQSdKmrJGJT0H-DhVcFZOsCR7CVV-YQoTtrLvnOwbSz1f0xvjxLNsrc3g5pZ0l-A==)
4. [medium.com](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQE56JkmOllcEL8vk8obd9COr38cNr2L9o4xq_emYpnfHFEjyqzuU5dock9QOAVfyYHZOB6jyl6o5PcVTv4__sd7e-UsSm4wwUT3Kap24ZK-LwLN_cOjEzWOXskjHlditT36C4CXqnsOAZq6dU8h9_rBj0-tvWYJ_JcBmNQYLUgr91nSHrfQxGIbGVrheDqA33eBBu5c9TMf3VMEUYh4jmbSEyARjVoObf5Wzu4vYXgg_BXG5T6VRyll9Hg=)
5. [visualstudiomagazine.com](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQEj6kgga9je_rtNmULL2J-Dd-w3MM2J-nFCSTaeULECPpoZ3-h6dLcQfSJB92qClGc2hTB5xiGilgpclp23EyK1GE2e0J1LGDrpH9eoSQ2zYSiqc-slCq3N4bkxa-HfqKj3v630oDSrDjxiowhUvFHCOUhe274BjfICG7TXWQAJGDG_ENw4piXq1UZEDVLfjm5_rK3paB4e5L9p1YCk)
6. [github.blog](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQGTOGUdRldyue3Os1Mv7m4hdWwH7bKioVj87sZD69IW_6OUuYRMrcU6tJVZQ3JxN_1Yjxq1sxaAdw8BUqnoo_KSSBX267VA94Eo-SmFSRf_8DHMIWDwNQy1AE8fp5KaDgt5rvpKHRFh65-UUDOd6A7B24kiCYJEEMzmTTm0N7Ys9-9v4pyE0tSY3tTqGo9j59SqUWWBgK3hf7Rxm6X_NtUOOQTvqZ1OwrPbNGGBcA==)
7. [github.com](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQE2RXmdDzctArkkLQMCRsSXbjB6_d7z9xDe89YnJF359dQYFDwHfhHGzMykKQmksk2Azdy8P9DDP1-83Nwh7z_GDYKw4era84xz5FVwIA86OW2BL-Qr764G)
8. [agents.md](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQFqUOLHv_ppMPVY6vQ8gjY7--YpTxkKyVnPnY6Pnvu5NsAgqZbsYPqfnMY5zjl4TKiuI_wpMRQbJ5Vqk6bUDrxMO6ZrfyNPSaw=)
9. [anthropic.com](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQFmrzQZ5QqoqrvC5iYs9Qf29_6LU-ZnUSc4ZLF4SI23tvWGeOye_EgDtoGbIUqY23SDliX-I1UKOd1isUitAd_Rp8J7joUg2chpMlxzSNvMp_91PVKP720JyjbN6xCnQouA68v0En3TYYZQhPQ2aa8G8teMYr3m)
10. [remio.ai](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHTAx9gaWdV_rNazMpd9Ug7sKsMm_c0bMGSADJxcVurD4BgpWkdOoEtOFpriRoU9RjvXYVfY8uukbtk9kdhhhzyTglxhBo82cpizWtrs59W46EALFS4tf-XlDVApw8IWwlzyL5J4lavjdYobTZV35DqzJnq3i-ZipYyJcL9FgFQlzDpu1leB-Gagk1z5YMICCU1z5fFTm_hMihcF9zkpw==)
11. [intuitionlabs.ai](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQEvmvjNjIbkm3iXlkwLi2Hc39eVU6IgR_m0wF_U_mRjL1x_feT6evElfwPlx6Gi3aAPghrdBFLIGKX2hsH9yzB-yDfTpZ8kUym7P52edss2Whl-OnVQcNDSBLt9jv-6D0cTgD-3rP_8ckOn-7qlwN8M4FSQ7UsfkOkmepR4)
12. [medium.com](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQGWhGT9zNoMMiwzgfGE1DH4HCWgoE8Tj0qmHRstkd_PRluEuyReNVwVUvMK0vs-LWpQWfSiRDNx2M-lepe6L9305hg3W_2Yyc4AOEhGwwjLQht5N3GfDDKIsYe9f1vqjxKccsbOa2kQ-dwxYVJQgkqwprwPlmH8leHJBdtc_b5crIesg8oG1ou5Xi3IZuWyfk61xXE=)
13. [medium.com](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQGdbxhHj9jESez5Wbp3aAQURIYJjT7zzJsknsQ8CENvokiGmDKjxdbx0D7JYyLJhDdPlN4WDfyHVbbwDMgZXhZOj3TYDxZnUnShldZf4NZ06Y4I6LgKvwQBl8rVs-0QNN-1iAh_j9WPVZhIZZBi0XerRmR1tQgJclUAq1biAol9tL9smloFbEc=)
14. [humanlayer.dev](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHFbcBOi5gOhjn_JqFzFKIslaw3QH5qp41joHuNpcMsZzA1x_rQHXdjJ1w8WAi8CLWaq9iPYpX6bQpw2xTDuKRZg-NzwCkSdJ0TyfPvfupQrMq-v3E7riJrfgYwAXupN2hzQ2eVBpApxdm_N-kh9Q==)
15. [solmaz.io](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQGTFBanVc7UIqa8482tp_fIxUsn00uGj24jn0OI0QiC0A1K_g5DTkBtimj13ohCUz_R2IJz_nX7JspwNKQZz1YBgfvZiln8mxMW7dr0gC08NyYo0TzLNrjp3ju2v9HOZMCCbFriHgwrjKClp41f3lxRAOWW-MR0dIs_pBI=)
16. [devshorts.in](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQG-xZVOV5DYwRHN1PU4K5NSRFYuPyUUy6TwrWu4PRboxEjCT8DKOdcYUIgDX7ZVGn4YgK2xeIaWYTl_tLnL3Bjrl5ElRmO8TjbA2qwfikadTCO2hvBZBUp7WKkF6GzhN2BcjKuUqsNjN21icAHiteFvbg==)
17. [classmethod.jp](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQEp1cjUyzJegJ4dZpsDJlwG0XJlZ9joHNaffDYR7jfeld4SBNdlTfrwOIC3yxEsawDpMV6dMuKvdUukVrd1XroqDSj0oOBMUU5eBKK_liezrmNJKnoEnvijkLzLGMpwd1Xb9aq9Tf8d8B7BHbsQfBVC5qEDAB_LO3MMlGOtFicpL0kmXFVeCJ5TZgw=)
18. [microsoft.com](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHEZw-ky_JQcdOjBQ9EAIlQZyoLzVcHaVBY94EgWqm6m171UiQOMB8AffCO1Bf_7Wjtpxh1CFuE5BrepJY4LEsR2ok7NlKVFkU4UTkzJ71z6oDyvx9Cen0A1hbC4HkIrC8aMvitUryuOb9ME56x6W100tWrnqt3Sv8HMWY=)
19. [github.com](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQG53nDh4Qiq1vQ5nn6ASFhSZwHHwYq-K-OcXo19MkPIiiO0Qn8CSApFNO4WHHGb-fl0GoCF1X5U2ft8ts_GoxU2jxdg_XIgnbY1GsrNXYgvZmBDNVqNelVK1-DuqErrf8UvGSDNYtG9aDeRmZU=)
20. [libraries.io](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQFhsi_YFUqvX3t45adPnoj9soy1GKqL13tBRxqSqDeD9rLyW3KqsbpYt-zHCghbYhYmeIYhb109JgDd58iXMQdD2W6iPxHrKv2ek2Ly86xomwvSBRZ8E5E2GQG7U6tE)
21. [reddit.com](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHeEHFwvMHlEgqJm3J7rpo2laEVtYclhmLZeWYg2BWd7gURgfuJ46Nl-9MH9YXYWG1Hm1TPPS_P9jcPpM0I3nV5VAJTIe7z1C08s7z1m6rIyHNE_7e67RvydIMhN3c9jnBdBW1xxjxKW5mx4yp2kiliNNrtlrDyFtXdVOWGq1J4wBA08HSmA23sbrfnyqbSGlQgMOMzqw==)
22. [github.com](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQF_3tjGi_-_j0sRb04zI3S9Xanwmkc0re7MfJSlfuDRksTA2X0epVYD-mijp984UslpgvW1QHXfruhJB8prJ7T7ylmqfW4KrvuDrU3hp5vQgSkqYegoyhHxH-vodttX)
23. [okigu.com](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQGEkzBINCGACWKpnZTiAOK8VfP05PO0EUkCFRtenUvEZUaUhlD7UfiRqvksMD50FV7-c9locGj1wk9UW3tP3lMwfRZC7lve19FEKegUhw==)
24. [oss-ai-swe.org](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQFWtlZ03aOGiZFTx5FV8WZm0RiXS5jpQOUnyUiC5iMtVSSSNlcfD5KsFbL3SE7og_ALYintPPUhBeKn_tWYH96L5o9ErKvNL_t5Po4UMzUJrYyv3g==)
25. [kdjingpai.com](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQFqBHX7AZT94mm79a59sYQ9-5dANIIWs0ztg4D-wjXyLbEDNP3Q-h0_9FJ9eefe7BQnfRjdhrblV9Q99eMo1JxuevcIzzvGeF6DRhxORZXoayHl_kSu9XCwFQ==)
26. [github.com](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQF9KxMq_2agCfKlEiYM4NSctU05U5WoDoaIuoIHHqZHSXHt5fS7JWFctj8woCbIr2IzXrY_ffX7k0kGu42mUdwNadUE4a1MncZIzN3iJ785o_S3YFPjxUpssdvahD5Zlza9F4DYrcKq)
27. [claude-plugins.dev](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQGyvHoRyhq5IaQryRySYiywIHzZ22cXcY8yEQfQ0FdVrFtUXR83xrD0RBp4PjzFT_fNtP3tlCTIOKz63g3xDb573X8JzDgFyCdnyeZgbLBDCL77KY0bGaGvZO5zk5Er5FiG9gvLonrONyqTJtywWNpoz8KQ5XyNHBN_ys0=)
28. [reddit.com](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQETTBRusq5sFM1IpwSmjlG8vFZ_mpJ9My2WYy-rj94H1xqKdIUUkjeMAiwIXaV-ufyJgXHZt-Z06l8b4T6DR3w8P1g9gecrM497qS-RFTkICQ3OUG26iotB8nS2fiZNmbA4yIhuplqRrjxy5ESxHmGBo-n6QeWRukGv22En6b5D0cZRV--Ovd7mr0FY4HO8POaGgjc=)
29. [github.com](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQGr6ZaB2MNbJhzsoIiM7BArdnd0iN2LOtfu_ZC0PRt5V9s4QWRauo4Nnlry32A6Ah8tbhfSP5lzQNHTBKopjXULDA6CXA1vVk5n111eZDJiU_yijodaWQwq5o69j9xtyCQdWo-rV8z7ipwAcQ==)
30. [skywork.ai](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHKJUv_Afazg8m9xPe9b6v1A0B1Qmf1YsgeK19xAAkuJu9MOImLlLtmp1gwRHqKCPypTUVjDbYMd5auNDZpqMuJquQwNLzZvfSnhXgIRun3n8tKfThzbQXYPDwMYht0_iHwZa4CWcOBH3ERKGxDxg7jbnqm2kBb2mqPZfyf7Kv9wb54)
31. [medium.com](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQGvhzH-uyVOOkNiZcoGb-68ALFVrL4yqA55E8kizzSjLcvUZPcI9tsd9WulrBPgv1_1VSxfocJoY4tTmpTmntbvPaIJA99Six9yiz6LNzmCVDHqzaeQgCgTCSzgU_pq7ykGG6-AlKV4kw7mJbFBisuTsr6yleckodzbJtRo2d49-YlejX4h6a2L9wO0XKtmV5lpIC2jaiBcfMUUzkc3BP3boeR7EcoX7pyz_amUwqm47DdPU2ATxyEL1WRgpLiKUUSIPTDnNT4-7k7AnckJSqIsuMfFfQ==)
