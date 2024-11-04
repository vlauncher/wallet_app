"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var users_controllers_1 = __importDefault(require("../controllers/users.controllers"));
var router = (0, express_1.Router)();
router.post('/register', users_controllers_1.default.register);
router.post('/login', users_controllers_1.default.login);
router.delete('/drop', users_controllers_1.default.deleteAllUsers);
exports.default = router;
