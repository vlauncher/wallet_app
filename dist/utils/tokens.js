"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessToken = generateAccessToken;
exports.verifyToken = verifyToken;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var JWT_SECRET = 'your-secret-key';
function generateAccessToken(userId) {
    return jsonwebtoken_1.default.sign({ userId: userId }, JWT_SECRET, { expiresIn: '1h' });
}
function verifyToken(token) {
    return jsonwebtoken_1.default.verify(token, JWT_SECRET);
}
