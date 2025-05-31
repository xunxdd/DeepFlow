"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode")); // Must import vscode namespace
const SecretStorage_1 = require("./utils/SecretStorage");
const path = __importStar(require("path"));
console.log("EXTENSION PRE-ACTIVATION CHECK"); // Should appear in Debug Console
const axios = require("axios");
async function getDeepSeekCodingHelp(selectedText) {
    const apiKey = await SecretStorage_1.SecretStorage.get("deepseekApiKey");
    if (!apiKey) {
        vscode.window.showErrorMessage("No API key found. Please set it first.");
        return null;
    }
    try {
        const response = await axios.post("https://api.deepseek.com/v1/chat/completions", {
            model: "deepseek-chat",
            messages: [
                {
                    role: "system",
                    content: "You are an expert programming assistant. Provide clear, concise, and accurate code solutions.",
                },
                {
                    role: "user",
                    content: selectedText,
                },
            ],
            temperature: 0.3,
            max_tokens: 2048,
        }, {
            headers: {
                Authorization: `Bearer ${apiKey}`, // Never hardcode API keys!
                "Content-Type": "application/json",
            },
        });
        return response.data.choices[0].message.content;
    }
    catch (error) {
        console.error("API Error:", error.response?.data || error.message);
        return null;
    }
}
function activate(context) {
    console.log("Project root:", path.resolve(__dirname, "..")); // Should print your project path
    console.log("Current working directory:", process.cwd());
    console.log("Extension activated!");
    SecretStorage_1.SecretStorage.init(context); // Initialize secret storage
    // Register a command that will be triggered from the right-click menu
    let disposable = vscode.commands.registerCommand("deepseek.query", async () => {
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
    });
    context.subscriptions.push(disposable);
}
function deactivate() { }
//# sourceMappingURL=extension.js.map