import { Router } from "express";
import { getWalletBalance, fundWallet, transferFundsToUser, withdrawFromAccount } from "../controllers/wallet.controllers";
import { auth } from "../middlewares/auth";

const router = Router();

router.get('/balance', auth, getWalletBalance);
router.post('/fund', fundWallet);
router.post('/transfer', transferFundsToUser);
router.post('/withdraw', withdrawFromAccount);

export default router;