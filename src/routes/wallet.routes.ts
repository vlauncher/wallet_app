import { Router } from "express";
import { getWalletBalance, fundWallet, transferFundsToUser, withdrawFromAccount } from "../controllers/wallet.controllers";
import { auth } from "../middlewares/auth";

const router = Router();

router.get('/balance', auth, getWalletBalance);
router.post('/fund',auth, fundWallet);
router.post('/transfer',auth, transferFundsToUser);
router.post('/withdraw', auth, withdrawFromAccount);

export default router;