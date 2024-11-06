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
var wallet_service_1 = require("../services/wallet.service");
var db_1 = __importDefault(require("../config/db"));
jest.mock('../config/db'); // Mock the entire db module
var walletService = new wallet_service_1.WalletService();
describe('WalletService', function () {
    var mockUserId = 1;
    var mockRecipientId = 2;
    var mockRecipientAccountId = 'recipient123';
    var mockWallet = { userId: mockUserId, balance: 1000 };
    beforeEach(function () {
        jest.clearAllMocks();
    });
    describe('createWallet', function () {
        it('should create a new wallet successfully', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        db_1.default.mockReturnValue({
                            insert: jest.fn().mockResolvedValue([1]) // Mock successful insertion
                        });
                        return [4 /*yield*/, walletService.createWallet(mockUserId)];
                    case 1:
                        _a.sent();
                        expect(db_1.default).toHaveBeenCalledWith('wallets');
                        expect((0, db_1.default)('wallets').insert).toHaveBeenCalledWith({ userId: mockUserId, balance: 0 });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('fundAccount', function () {
        it('should fund a user account successfully', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        db_1.default.mockReturnValue({
                            where: jest.fn().mockReturnThis(),
                            increment: jest.fn().mockResolvedValue(1), // Mock successful increment
                        });
                        return [4 /*yield*/, walletService.fundAccount(mockUserId, 500)];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual({ message: 'Account funded successfully' });
                        expect((0, db_1.default)().where).toHaveBeenCalledWith({ userId: mockUserId });
                        expect((0, db_1.default)().increment).toHaveBeenCalledWith('balance', 500);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should throw an error if wallet is not found', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        db_1.default.mockReturnValue({
                            where: jest.fn().mockReturnThis(),
                            increment: jest.fn().mockResolvedValue(0), // No wallet found
                        });
                        return [4 /*yield*/, expect(walletService.fundAccount(mockUserId, 500)).rejects.toThrow('Wallet not found')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('transferFunds', function () {
        it('should transfer funds between wallets successfully', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        db_1.default.mockReturnValue({
                            where: jest.fn().mockReturnThis(),
                            first: jest.fn().mockResolvedValue({ id: mockRecipientId }), // Recipient found
                        });
                        // Mock the transaction to simulate DB operations
                        db_1.default.transaction = jest.fn().mockImplementation(function (callback) { return __awaiter(void 0, void 0, void 0, function () {
                            var trx;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        trx = jest.fn().mockReturnValue({
                                            where: jest.fn().mockReturnThis(),
                                            first: jest.fn().mockResolvedValue(mockWallet),
                                            decrement: jest.fn().mockResolvedValue(1),
                                            increment: jest.fn().mockResolvedValue(1),
                                        });
                                        return [4 /*yield*/, callback(trx)];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); });
                        return [4 /*yield*/, walletService.transferFunds(mockUserId, mockRecipientAccountId, 500)];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual({ message: 'Funds transferred successfully' });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should throw an error if recipient is not found', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        db_1.default.mockReturnValue({
                            where: jest.fn().mockReturnThis(),
                            first: jest.fn().mockResolvedValue(null), // No recipient found
                        });
                        return [4 /*yield*/, expect(walletService.transferFunds(mockUserId, mockRecipientAccountId, 500)).rejects.toThrow('Recipient not found')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should throw an error if sender has insufficient funds', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        db_1.default.mockReturnValue({
                            where: jest.fn().mockReturnThis(),
                            first: jest.fn().mockResolvedValue(mockWallet), // Sender found
                        });
                        db_1.default.transaction = jest.fn().mockImplementation(function (callback) { return __awaiter(void 0, void 0, void 0, function () {
                            var trx;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        trx = jest.fn().mockReturnValue({
                                            where: jest.fn().mockReturnThis(),
                                            first: jest.fn().mockResolvedValue(__assign(__assign({}, mockWallet), { balance: 200 })), // Sender with low balance
                                            decrement: jest.fn().mockResolvedValue(1),
                                            increment: jest.fn().mockResolvedValue(1),
                                        });
                                        return [4 /*yield*/, callback(trx)];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); });
                        return [4 /*yield*/, expect(walletService.transferFunds(mockUserId, mockRecipientAccountId, 500)).rejects.toThrow('Insufficient balance')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('withdrawFunds', function () {
        it('should withdraw funds successfully', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        db_1.default.mockReturnValue({
                            where: jest.fn().mockReturnThis(),
                            first: jest.fn().mockResolvedValue(mockWallet), // Wallet with sufficient funds
                            decrement: jest.fn().mockResolvedValueOnce(1), // Successful decrement
                        });
                        return [4 /*yield*/, walletService.withdrawFunds(mockUserId, 500)];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual({ message: 'Withdrawal successful' });
                        expect((0, db_1.default)().decrement).toHaveBeenCalledWith('balance', 500);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should throw an error if insufficient funds', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        db_1.default.mockReturnValue({
                            where: jest.fn().mockReturnThis(),
                            first: jest.fn().mockResolvedValue(__assign(__assign({}, mockWallet), { balance: 100 })), // Low balance
                        });
                        return [4 /*yield*/, expect(walletService.withdrawFunds(mockUserId, 500)).rejects.toThrow('Insufficient funds')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getBalance', function () {
        it('should get the wallet balance successfully', function () { return __awaiter(void 0, void 0, void 0, function () {
            var balance;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        db_1.default.mockReturnValue({
                            where: jest.fn().mockReturnThis(),
                            first: jest.fn().mockResolvedValue(mockWallet),
                        });
                        return [4 /*yield*/, walletService.getBalance(mockUserId)];
                    case 1:
                        balance = _a.sent();
                        expect(balance).toBe(mockWallet.balance);
                        expect((0, db_1.default)().where).toHaveBeenCalledWith({ userId: mockUserId });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should throw an error if wallet not found', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        db_1.default.mockReturnValue({
                            where: jest.fn().mockReturnThis(),
                            first: jest.fn().mockResolvedValue(null), // No wallet found
                        });
                        return [4 /*yield*/, expect(walletService.getBalance(mockUserId)).rejects.toThrow('Wallet not found')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
