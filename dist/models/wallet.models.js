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
exports.WalletModel = void 0;
var db_1 = __importDefault(require("../config/db"));
exports.WalletModel = {
    // Create Wallet Table
    createWalletTable: function () {
        return __awaiter(this, void 0, void 0, function () {
            var exists, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, db_1.default.schema.hasTable('wallets')];
                    case 1:
                        exists = _a.sent();
                        if (!!exists) return [3 /*break*/, 3];
                        return [4 /*yield*/, db_1.default.schema.createTable('wallets', function (table) {
                                table.increments('id').primary();
                                table.integer('userId').unsigned().unique().notNullable()
                                    .references('id').inTable('users').onDelete('CASCADE');
                                table.decimal('balance', 10, 2).defaultTo(0);
                            })];
                    case 2:
                        _a.sent();
                        console.log('Wallets table created');
                        return [3 /*break*/, 4];
                    case 3:
                        console.log('Wallets table already exists');
                        _a.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_1 = _a.sent();
                        console.error('Error creating Wallets table:', error_1);
                        throw error_1;
                    case 6: return [2 /*return*/];
                }
            });
        });
    },
    // Create a new wallet for a user
    createWallet: function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, db_1.default)('wallets').insert({
                                userId: userId,
                                balance: 0, // Initial balance set to 0
                            })];
                    case 1:
                        _a.sent();
                        console.log("Wallet created for user ".concat(userId));
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        console.error('Error creating wallet:', error_2);
                        throw error_2;
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    // Fund account with a specified amount
    fundAccount: function (userId, amount) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_3;
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
                        if (result === 0) {
                            throw new Error('Wallet not found');
                        }
                        return [2 /*return*/, { message: 'Account funded successfully' }];
                    case 3:
                        error_3 = _a.sent();
                        console.error('Error funding account:', error_3.message);
                        throw error_3;
                    case 4: return [2 /*return*/];
                }
            });
        });
    },
    // Transfer funds from one user to another
    transferFunds: function (senderId, recipientAccountId, amount) {
        return __awaiter(this, void 0, void 0, function () {
            var recipient_1, error_4;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (senderId === undefined || !recipientAccountId || amount === undefined) {
                            throw new Error('Sender ID, recipient account ID, and amount must all be provided');
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, (0, db_1.default)('users').where({ accountId: recipientAccountId }).first()];
                    case 2:
                        recipient_1 = _a.sent();
                        if (!recipient_1) {
                            throw new Error('Recipient account not found');
                        }
                        return [4 /*yield*/, db_1.default.transaction(function (trx) { return __awaiter(_this, void 0, void 0, function () {
                                var senderWallet;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, trx('wallets').where({ userId: senderId }).first()];
                                        case 1:
                                            senderWallet = _a.sent();
                                            if (!senderWallet || senderWallet.balance < amount) {
                                                throw new Error('Insufficient balance or sender wallet not found');
                                            }
                                            return [4 /*yield*/, trx('wallets').where({ userId: senderId }).decrement('balance', amount)];
                                        case 2:
                                            _a.sent();
                                            return [4 /*yield*/, trx('wallets').where({ userId: recipient_1.id }).increment('balance', amount)];
                                        case 3:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, { message: 'Funds transferred successfully' }];
                    case 4:
                        error_4 = _a.sent();
                        console.error('Error transferring funds:', error_4.message);
                        throw error_4;
                    case 5: return [2 /*return*/];
                }
            });
        });
    },
    // Withdraw funds from a user account
    withdrawFunds: function (userId, amount) {
        return __awaiter(this, void 0, void 0, function () {
            var wallet, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, (0, db_1.default)('wallets').where({ userId: userId }).first()];
                    case 1:
                        wallet = _a.sent();
                        if (!wallet) {
                            throw new Error('Wallet not found');
                        }
                        if (wallet.balance < amount) {
                            throw new Error('Insufficient funds');
                        }
                        return [4 /*yield*/, (0, db_1.default)('wallets').where({ userId: userId }).decrement('balance', amount)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, { message: 'Withdrawal successful' }];
                    case 3:
                        error_5 = _a.sent();
                        console.error('Error during withdrawal:', error_5.message);
                        throw error_5;
                    case 4: return [2 /*return*/];
                }
            });
        });
    },
    // Get balance for a user account
    getBalance: function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var wallet, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, db_1.default)('wallets').where({ userId: userId }).first()];
                    case 1:
                        wallet = _a.sent();
                        if (!wallet) {
                            throw new Error('Wallet not found');
                        }
                        return [2 /*return*/, wallet.balance];
                    case 2:
                        error_6 = _a.sent();
                        console.error('Error fetching balance:', error_6.message);
                        throw error_6;
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
};
