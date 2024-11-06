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
// tests/users.service.test.ts
var users_service_1 = __importDefault(require("../services/users.service"));
var axios_1 = __importDefault(require("axios"));
var bcryptjs_1 = __importDefault(require("bcryptjs"));
jest.mock('axios');
jest.mock('bcryptjs');
// Mock DB configuration
var mockDb = {
    where: jest.fn().mockReturnThis(),
    first: jest.fn(),
    insert: jest.fn(),
};
jest.mock('../config/db', function () {
    return {
        __esModule: true,
        default: jest.fn(function () { return mockDb; }),
    };
});
describe('UserService', function () {
    var mockUser = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        accountId: '1234567890',
    };
    beforeEach(function () {
        jest.clearAllMocks();
        bcryptjs_1.default.hash.mockResolvedValue('hashed_password');
        mockDb.where.mockReturnThis();
        mockDb.first.mockResolvedValue(null);
        mockDb.insert.mockResolvedValue([1]);
    });
    describe('register', function () {
        it('should register a user successfully', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        axios_1.default.get.mockResolvedValue({ data: { blacklisted: false } });
                        mockDb.where.mockReturnValueOnce({
                            first: jest.fn().mockResolvedValue(null),
                        });
                        return [4 /*yield*/, users_service_1.default.register(mockUser)];
                    case 1:
                        user = _a.sent();
                        expect(user).toEqual(expect.objectContaining({ email: mockUser.email, id: 1 }));
                        expect(mockDb.insert).toHaveBeenCalledWith(expect.objectContaining({
                            firstName: mockUser.firstName,
                            lastName: mockUser.lastName,
                            email: mockUser.email,
                            accountId: mockUser.accountId,
                            password: 'hashed_password', // Expect hashed password
                        }));
                        return [2 /*return*/];
                }
            });
        }); });
        it('should throw an error if user is blacklisted', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        axios_1.default.get.mockResolvedValue({ data: { blacklisted: true, message: 'User is blacklisted' } });
                        return [4 /*yield*/, expect(users_service_1.default.register(mockUser)).rejects.toThrow('User is blacklisted')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should throw an error if user already exists', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        axios_1.default.get.mockResolvedValue({ data: { blacklisted: false } });
                        mockDb.where.mockReturnValueOnce({
                            first: jest.fn().mockResolvedValue(mockUser),
                        });
                        return [4 /*yield*/, expect(users_service_1.default.register(mockUser)).rejects.toThrow('User already exists')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('login', function () {
        it('should log in successfully', function () { return __awaiter(void 0, void 0, void 0, function () {
            var hashedPassword, _a, user, token;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, bcryptjs_1.default.hash(mockUser.password, 10)];
                    case 1:
                        hashedPassword = _b.sent();
                        // Mock the database response to return the mock user with a hashed password
                        mockDb.where.mockReturnValueOnce({
                            first: jest.fn().mockResolvedValue(__assign(__assign({}, mockUser), { password: hashedPassword })),
                        });
                        // Mock bcrypt to return true for password comparison
                        bcryptjs_1.default.compare.mockResolvedValue(true);
                        return [4 /*yield*/, users_service_1.default.login(mockUser.email, mockUser.password)];
                    case 2:
                        _a = _b.sent(), user = _a.user, token = _a.token;
                        // Assertions
                        expect(user).toEqual(expect.objectContaining({ email: mockUser.email }));
                        expect(token).toBeDefined();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should throw an error if user is not found', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockDb.where.mockReturnValueOnce({
                            first: jest.fn().mockResolvedValue(undefined),
                        });
                        return [4 /*yield*/, expect(users_service_1.default.login(mockUser.email, mockUser.password)).rejects.toThrow('User not found')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should throw an error if password is incorrect', function () { return __awaiter(void 0, void 0, void 0, function () {
            var hashedPassword;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, bcryptjs_1.default.hash(mockUser.password, 10)];
                    case 1:
                        hashedPassword = _a.sent();
                        mockDb.where.mockReturnValueOnce({
                            first: jest.fn().mockResolvedValue(__assign(__assign({}, mockUser), { password: hashedPassword })),
                        });
                        bcryptjs_1.default.compare.mockResolvedValue(false);
                        return [4 /*yield*/, expect(users_service_1.default.login(mockUser.email, 'wrong_password')).rejects.toThrow('Incorrect password')];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
