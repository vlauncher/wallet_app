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
exports.createWallet = createWallet;
exports.fundAccount = fundAccount;
exports.transferFunds = transferFunds;
exports.withdrawFunds = withdrawFunds;
exports.getBalance = getBalance;
var db_1 = __importDefault(require("../config/db"));
// Create a wallet for a new user
function createWallet(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, db_1.default)('wallets').insert({
                            userId: userId,
                            balance: 0, // Initial balance
                        })];
                case 1:
                    _a.sent();
                    console.log("Wallet created for user ".concat(userId));
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error('Error creating wallet:', error_1);
                    throw error_1;
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Fund a user's wallet
function fundAccount(userId, amount) {
    return __awaiter(this, void 0, void 0, function () {
        var result, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!userId || amount === undefined) {
                        throw new Error('Both userId and amount must be provided');
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, db_1.default)('wallets')
                            .where({ userId: userId })
                            .increment('balance', amount)];
                case 2:
                    result = _a.sent();
                    if (result === 0)
                        throw new Error('User wallet not found');
                    return [2 /*return*/, { message: 'Account funded successfully' }];
                case 3:
                    error_2 = _a.sent();
                    console.error('Error funding account:', error_2);
                    throw error_2;
                case 4: return [2 /*return*/];
            }
        });
    });
}
// Transfer funds from one user to another
function transferFunds(senderId, recipientAccountId, amount) {
    return __awaiter(this, void 0, void 0, function () {
        var recipient;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, db_1.default)('users').where({ accountId: recipientAccountId }).first()];
                case 1:
                    recipient = _a.sent();
                    if (!recipient)
                        throw new Error('Recipient not found');
                    return [4 /*yield*/, db_1.default.transaction(function (trx) { return __awaiter(_this, void 0, void 0, function () {
                            var senderWallet;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, trx('wallets').where({ userId: senderId }).first()];
                                    case 1:
                                        senderWallet = _a.sent();
                                        if (!senderWallet || senderWallet.balance < amount)
                                            throw new Error('Insufficient balance');
                                        return [4 /*yield*/, trx('wallets').where({ userId: senderId }).decrement('balance', amount)];
                                    case 2:
                                        _a.sent();
                                        return [4 /*yield*/, trx('wallets').where({ userId: recipient.id }).increment('balance', amount)];
                                    case 3:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// Withdraw funds from a user's wallet
function withdrawFunds(userId, amount) {
    return __awaiter(this, void 0, void 0, function () {
        var wallet;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, db_1.default)('wallets').where({ userId: userId }).first()];
                case 1:
                    wallet = _a.sent();
                    if (!wallet || wallet.balance < amount)
                        throw new Error('Insufficient funds');
                    return [4 /*yield*/, (0, db_1.default)('wallets').where({ userId: userId }).decrement('balance', amount)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// Retrieve wallet balance
function getBalance(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var wallet;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, db_1.default)('wallets').where({ userId: userId }).first()];
                case 1:
                    wallet = _a.sent();
                    if (!wallet)
                        throw new Error('Wallet not found');
                    return [2 /*return*/, wallet.balance];
            }
        });
    });
}
