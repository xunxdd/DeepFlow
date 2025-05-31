"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecretStorage = void 0;
class SecretStorage {
    static instance;
    secrets;
    constructor(context) {
        this.secrets = context.secrets;
    }
    static init(context) {
        SecretStorage.instance = new SecretStorage(context);
    }
    static async store(key, value) {
        await SecretStorage.instance.secrets.store(key, value);
    }
    static async get(key) {
        return await SecretStorage.instance.secrets.get(key);
    }
}
exports.SecretStorage = SecretStorage;
//# sourceMappingURL=SecretStorage.js.map