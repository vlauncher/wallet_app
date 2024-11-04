"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var wallet_controllers_1 = require("../controllers/wallet.controllers");
var auth_1 = require("../middlewares/auth");
var router = (0, express_1.Router)();
router.get('/balance', auth_1.auth, wallet_controllers_1.getWalletBalance);
router.post('/fund', auth_1.auth, wallet_controllers_1.fundWallet);
router.post('/transfer', auth_1.auth, wallet_controllers_1.transferFundsToUser);
router.post('/withdraw', auth_1.auth, wallet_controllers_1.withdrawFromAccount);
exports.default = router;