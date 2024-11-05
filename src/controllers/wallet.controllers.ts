// src/controllers/WalletController.ts
import { Request, Response } from 'express';
import { WalletService } from '../services/wallet.service';

const walletService = new WalletService();

export class WalletController {
  async fundWallet(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const { amount } = req.body;
      const result = await walletService.fundAccount(userId, amount);
      res.status(200).json(result);
    } catch (error: any) {
      console.error('Error in fundWallet:', error.message);
      res.status(500).json({ message: 'Failed to fund account', error: error.message });
    }
  }

  async transferFundsToUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const { recipientAccountId, amount } = req.body;
      const result = await walletService.transferFunds(userId, recipientAccountId, amount);
      res.status(200).json(result);
    } catch (error: any) {
      console.error('Error in transferFundsToUser:', error.message);
      res.status(500).json({ message: 'Failed to transfer funds', error: error.message });
    }
  }

  async withdrawFromAccount(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const { amount } = req.body;
      const result = await walletService.withdrawFunds(userId, amount);
      res.status(200).json(result);
    } catch (error: any) {
      console.error('Error in withdrawFromAccount:', error.message);
      res.status(500).json({ message: 'Failed to withdraw funds', error: error.message });
    }
  }

  async getWalletBalance(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const balance = await walletService.getBalance(userId);
      res.status(200).json({ balance });
    } catch (error: any) {
      console.error('Error in getWalletBalance:', error.message);
      res.status(500).json({ message: 'Failed to get balance', error: error.message });
    }
  }
}
