# Gemini Research CLI

[![License: ISC](https://img.shields.io/badge/License-ISC-yellow.svg)](https://opensource.org/licenses/ISC)
[![Platform](https://img.shields.io/badge/Platform-macOS%20%7C%20Linux%20%7C%20Windows-blue.svg)](#installation)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue.svg)](https://www.typescriptlang.org/)

**Deep Research Agent CLI** - A powerful command-line interface for Gemini's Deep Research Agent, capable of autonomously planning, executing, and reporting on complex research topics.

Perfect for deep dives into technical topics, market analysis, competitor research, and creating comprehensive knowledge bases from scratch.

## ✨ Features

- 🧠 **Autonomous Planning** - Leverages **Gemini 3 Flash Preview** (with fallback to 2.0) to create detailed research plans
- 📚 **Deep Research** - Executes multi-step research using Google Search and internal reasoning
- 🔄 **Auto-Polling** - Handles long-running background tasks with automatic status updates
- ⚡ **Resilient** - Auto-recovers from transient network issues during polling
- 📝 **Markdown Export** - Saves formatted reports directly to your local machine
- 🛡️ **Safe Filenames** - Automatically sanitizes output filenames for cross-platform compatibility
- 🚦 **Interactive CLI** - Simple interactive mode or direct command-line arguments

## 📦 Quick Start

### Prerequisites
- Node.js (v18+)
- Gemini API Key (Interactions API enabled)

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/gemini-deep-research.git
cd gemini-deep-research
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure Environment:**
Copy the example environment file and add your API key:
```bash
cp .env.example .env
# Edit .env and paste your GEMINI_API_KEY
```

4. **Build the project:**
```bash
npm run build
```

5. **Link (Optional):**
Allows you to run `gemini-research` from anywhere.
```bash
npm link
```

### Basic Usage

```bash
# Research a specific topic directly
gemini-research "The future of quantum computing in 2025"

# Run in interactive mode
gemini-research
```

The CLI will:
1.  Generate a research plan for your review (Yes/No to proceed).
2.  Initialize the Deep Research Agent.
3.  Start the research process in the background.
4.  Poll for progress (research can take 10+ minutes).
5.  Save the final report as a Markdown file.

## ⚙️ Configuration Options

| Option | Description |
|--------|-------------|
| `topic` | The research topic (pass as first argument) |
| `.env` | File to store your `GEMINI_API_KEY` |

## 🏗️ Project Structure

```
gemini-deep-research/
├── dist/                  # Compiled JavaScript files
├── docs/                  # Documentation
├── src/
│   ├── api.ts             # Gemini API client
│   ├── cli.ts             # Main CLI logic & UI
│   └── test_*.ts          # Test scripts
├── .env                   # API Key configuration
├── package.json           # Dependencies & Scripts
└── README.md              # This documentation
```

## 🛠️ Troubleshooting

- **404 Model Not Found**: Ensure you are using a valid `GEMINI_API_KEY` that has access to the `deep-research-pro-preview-12-2025` model in the Interactions API.
- **ENAMETOOLONG**: The CLI automatically truncates filenames to 50 characters to prevent this, but ensure your filesystem supports standard long filenames.
- **Timeout/Network Error**: The tool is designed to be resilient to transient network drops. If the process hangs for >20 minutes without updates, check your connection and strict firewall settings.

## 🤝 Contributing

Contributions are welcome! Please run the build script before submitting a PR.

## 📄 License

This project is licensed under the ISC License.

