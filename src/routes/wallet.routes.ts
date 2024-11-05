// src/routes/wallet.routes.ts
import { Router } from 'express';
import { WalletController } from '../controllers/wallet.controllers';
import { auth } from '../middlewares/auth';

const router = Router();
const walletController = new WalletController();

router.get('/balance', auth, walletController.getWalletBalance.bind(walletController));
router.post('/fund', auth, walletController.fundWallet.bind(walletController));
router.post('/transfer', auth, walletController.transferFundsToUser.bind(walletController));
router.post('/withdraw', auth, walletController.withdrawFromAccount.bind(walletController));

export default router;
