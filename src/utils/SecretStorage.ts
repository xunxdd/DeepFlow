// src/utils/SecretStorage.ts
import * as vscode from "vscode";

export class SecretStorage {
  private static instance: SecretStorage;
  private secrets: vscode.SecretStorage;

  private constructor(context: vscode.ExtensionContext) {
    this.secrets = context.secrets;
  }

  public static init(context: vscode.ExtensionContext): void {
    SecretStorage.instance = new SecretStorage(context);
  }

  public static async store(key: string, value: string): Promise<void> {
    await SecretStorage.instance.secrets.store(key, value);
  }

  public static async get(key: string): Promise<string | undefined> {
    return await SecretStorage.instance.secrets.get(key);
  }
}
