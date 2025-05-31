import * as vscode from "vscode";
import { SecretStorage } from "../utils/SecretStorage";

export async function setApiKey() {
  const key = await vscode.window.showInputBox({
    placeHolder: "Enter your DeepSeek API key",
    password: true,
    ignoreFocusOut: true,
  });

  if (key) {
    await SecretStorage.store("deepseekApiKey", key);
    vscode.window.showInformationMessage("API key saved securely!");
  }
}
