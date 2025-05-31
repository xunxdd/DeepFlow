import * as vscode from "vscode"; // Must import vscode namespace
import { SecretStorage } from "./utils/SecretStorage";
import * as path from "path";

console.log("EXTENSION PRE-ACTIVATION CHECK"); // Should appear in Debug Console

const axios = require("axios");

async function getDeepSeekCodingHelp(selectedText: string) {
  const apiKey = await SecretStorage.get("deepseekApiKey");

  if (!apiKey) {
    vscode.window.showErrorMessage("No API key found. Please set it first.");
    return null;
  }

  try {
    const response = await axios.post(
      "https://api.deepseek.com/v1/chat/completions",
      {
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content:
              "You are an expert programming assistant. Provide clear, concise, and accurate code solutions.",
          },
          {
            role: "user",
            content: selectedText,
          },
        ],
        temperature: 0.3,
        max_tokens: 2048,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`, // Never hardcode API keys!
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.choices[0].message.content;
  } catch (error: any) {
    console.error("API Error:", error.response?.data || error.message);
    return null;
  }
}

export function activate(context: vscode.ExtensionContext) {
  console.log("Project root:", path.resolve(__dirname, "..")); // Should print your project path
  console.log("Current working directory:", process.cwd());
  console.log("Extension activated!");
  SecretStorage.init(context); // Initialize secret storage
  // Register a command that will be triggered from the right-click menu
  let disposable = vscode.commands.registerCommand(
    "deepseek.query",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("No active editor!");
        return;
      }

      const selection = editor.selection;
      const selectedText = editor.document.getText(selection);

      if (!selectedText) {
        vscode.window.showErrorMessage("No text selected!");
        return;
      }

      const response = await getDeepSeekCodingHelp(selectedText);
      if (response) {
        editor.edit((editBuilder) => {
          editBuilder.replace(selection, response);
        });
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
