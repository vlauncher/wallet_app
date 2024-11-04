"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var users_service_1 = __importDefault(require("../services/users.service"));
var db_1 = __importDefault(require("../config/db"));
var users_models_1 = require("../models/users.models");
var UserController = /** @class */ (function () {
    function UserController() {
    }
    // Register a new user
    UserController.prototype.register = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, firstName, lastName, email, password, accountId, user, existingWallet, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 6, , 7]);
                        _a = req.body, firstName = _a.firstName, lastName = _a.lastName, email = _a.email, password = _a.password;
                        // Validate required fields
                        if (!firstName || !lastName || !email || !password) {
                            res.status(400).json({ message: 'All fields are required' });
                            return [2 /*return*/];
                        }
                        accountId = Math.random().toString().slice(2, 13);
                        return [4 /*yield*/, users_service_1.default.register({ firstName: firstName, lastName: lastName, email: email, password: password, accountId: accountId })];
                    case 1:
                        user = _b.sent();
                        return [4 /*yield*/, (0, db_1.default)('wallets').where({ userId: user.id }).first()];
                    case 2:
                        existingWallet = _b.sent();
                        if (!!existingWallet) return [3 /*break*/, 4];
                        // Only create a wallet if it does not already exist
                        return [4 /*yield*/, (0, db_1.default)('wallets').insert({ userId: user.id, balance: 0 })];
                    case 3:
                        // Only create a wallet if it does not already exist
                        _b.sent();
                        console.log("Wallet created for user ".concat(user.id));
                        return [3 /*break*/, 5];
                    case 4:
                        console.log("Wallet already exists for user ".concat(user.id));
                        _b.label = 5;
                    case 5:
                        res.status(201).json({ message: 'User registered successfully', user: user });
                        return [3 /*break*/, 7];
                    case 6:
                        error_1 = _b.sent();
                        res.status(400).json({ message: error_1.message });
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    // Log in an existing user
    // Log in an existing user
    UserController.prototype.login = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, email, password, _b, user, token, error_2;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        _a = req.body, email = _a.email, password = _a.password;
                        // Validate request data
                        if (!email || !password) {
                            res.status(400).json({ message: 'Email and password are required' });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, users_service_1.default.login(email, password)];
                    case 1:
                        _b = _c.sent(), user = _b.user, token = _b.token;
                        res.status(200).json({ message: 'Login successful', user: user, token: token });
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _c.sent();
                        res.status(401).json({ message: error_2.message });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.deleteAllUsers = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, users_models_1.deleteAllUsers)()];
                    case 1:
                        _a.sent();
                        res.status(200).json({ message: 'All users deleted' });
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        res.status(500).json({ message: 'Failed to delete all users' });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return UserController;
}());
exports.default = new UserController();
