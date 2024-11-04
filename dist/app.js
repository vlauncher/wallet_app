"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var dotenv_1 = require("dotenv");
var users_routes_1 = __importDefault(require("./routes/users.routes"));
var wallet_routes_1 = __importDefault(require("./routes/wallet.routes"));
(0, dotenv_1.config)();
var app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
// Routes
app.use('/api/v1/auth', users_routes_1.default);
app.use('/api/v1/wallet', wallet_routes_1.default);
exports.default = app;
