"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var db_1 = __importDefault(require("../config/db"));
var tokens_1 = require("../utils/tokens");
var axios_1 = __importDefault(require("axios"));
var KARMA_API_URL = process.env.KARMA_API_URL;
var KARMA_API_KEY = process.env.KARMA_API_KEY;
var UserService = /** @class */ (function () {
    function UserService() {
    }
    // Method to verify email with Karma API for blacklisted users
    UserService.verifyWithKarma = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var karmaApiUrl, response, error_1;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        karmaApiUrl = "".concat(KARMA_API_URL, "/").concat(email);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, axios_1.default.get(karmaApiUrl, {
                                headers: { Authorization: "Bearer ".concat(KARMA_API_KEY) },
                            })];
                    case 2:
                        response = _b.sent();
                        return [2 /*return*/, response.data];
                    case 3:
                        error_1 = _b.sent();
                        console.error("Karma API Request Error:", error_1.message);
                        if (axios_1.default.isAxiosError(error_1)) {
                            if (error_1.response) {
                                console.error('Response data:', error_1.response.data);
                                console.error('Status code:', error_1.response.status);
                                console.error('Headers:', error_1.response.headers);
                            }
                            else if (error_1.request) {
                                console.error('Request made but no response received:', error_1.request);
                            }
                            else {
                                console.error('Error setting up request:', error_1.message);
                            }
                        }
                        if (axios_1.default.isAxiosError(error_1) && ((_a = error_1.response) === null || _a === void 0 ? void 0 : _a.status) === 404) {
                            console.log("Identity not found in Karma ecosystem, allowing registration");
                            return [2 /*return*/, { blacklisted: false, message: "Identity not found in Karma ecosystem" }];
                        }
                        else {
                            throw new Error("Failed to verify email with Karma API");
                        }
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // Register a new user
    UserService.prototype.register = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var karmaCheck, existingUser, accountId, hashedPassword, userId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, UserService.verifyWithKarma(user.email)];
                    case 1:
                        karmaCheck = _a.sent();
                        if (karmaCheck.blacklisted) {
                            throw new Error(karmaCheck.message || 'User is blacklisted');
                        }
                        return [4 /*yield*/, (0, db_1.default)('users').where({ email: user.email }).first()];
                    case 2:
                        existingUser = _a.sent();
                        if (existingUser) {
                            throw new Error('User already exists');
                        }
                        accountId = user.accountId || Math.random().toString().slice(2, 13);
                        return [4 /*yield*/, bcryptjs_1.default.hash(user.password, 10)];
                    case 3:
                        hashedPassword = _a.sent();
                        return [4 /*yield*/, (0, db_1.default)('users').insert(__assign(__assign({}, user), { accountId: accountId, password: hashedPassword }))];
                    case 4:
                        userId = (_a.sent())[0];
                        // Return the created user with the user ID
                        return [2 /*return*/, __assign(__assign({}, user), { id: userId })];
                }
            });
        });
    };
    // Login user by verifying email and password
    UserService.prototype.login = function (email, password) {
        return __awaiter(this, void 0, void 0, function () {
            var user, isMatch, token, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, (0, db_1.default)('users').where({ email: email }).first()];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            throw new Error('User not found');
                        }
                        return [4 /*yield*/, bcryptjs_1.default.compare(password, user.password)];
                    case 2:
                        isMatch = _a.sent();
                        if (!isMatch) {
                            throw new Error('Incorrect password');
                        }
                        token = (0, tokens_1.generateAccessToken)(user.id);
                        return [2 /*return*/, { user: user, token: token }];
                    case 3:
                        error_2 = _a.sent();
                        console.error('Error in login:', error_2);
                        throw error_2;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    //   Delete all users
    UserService.prototype.deleteAllUsers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, db_1.default)('users').del()];
                    case 1:
                        _a.sent();
                        console.log('All users deleted');
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        console.error('Error deleting all users:', error_3);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return UserService;
}());
exports.default = new UserService();
