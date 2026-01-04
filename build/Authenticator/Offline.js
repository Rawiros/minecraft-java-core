"use strict";
/**
 * @author Rawir
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
const crypto_1 = __importDefault(require("crypto"));
function login(username) {
    let UUID = crypto_1.default.randomBytes(16).toString('hex');
    return {
        access_token: UUID,
        client_token: UUID,
        uuid: UUID,
        name: username,
        user_properties: '{}',
        meta: {
            online: false,
            type: 'Mojang'
        }
    };
}
//# sourceMappingURL=Offline.js.map