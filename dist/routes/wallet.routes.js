"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/wallet.routes.ts
var express_1 = require("express");
var wallet_controllers_1 = require("../controllers/wallet.controllers");
var auth_1 = require("../middlewares/auth");
var router = (0, express_1.Router)();
var walletController = new wallet_controllers_1.WalletController();
router.get('/balance', auth_1.auth, walletController.getWalletBalance.bind(walletController));
router.post('/fund', auth_1.auth, walletController.fundWallet.bind(walletController));
router.post('/transfer', auth_1.auth, walletController.transferFundsToUser.bind(walletController));
router.post('/withdraw', auth_1.auth, walletController.withdrawFromAccount.bind(walletController));
exports.default = router;
