import { Request, Response } from 'express';
import {
  fundAccount,
  transferFunds,
  withdrawFunds,
  getBalance,
} from '../services/wallet.service';

export async function fundWallet(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as any).user.userId;
    const { amount } = req.body;

    if (!userId || amount === undefined) {
      res.status(400).json({ message: 'userId and amount are required' });
      return;
    }

    const result = await fundAccount(userId, amount);
    res.status(200).json(result);
  } catch (error: any) {
    console.error('Error in fundWallet:', error.message);
    res.status(500).json({ message: 'Failed to fund account', error: error.message });
  }
}

export async function transferFundsToUser(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as any).user.userId;
    const { recipientAccountId, amount } = req.body;

    await transferFunds(userId, recipientAccountId, amount);
    res.json({ message: 'Transfer successful' });
  } catch (error: any) {
    console.error('Error in transferFundsToUser:', error.message);
    res.status(500).json({ message: 'Failed to transfer funds', error: error.message });
  }
}

export async function withdrawFromAccount(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as any).user.userId;
    const { amount } = req.body;

    const balance = await getBalance(userId);
    if (amount > balance) {
      res.status(400).json({ message: 'Insufficient funds' });
      return;
    }

    await withdrawFunds(userId, amount);
    res.json({ message: 'Withdrawal successful' });
  } catch (error: any) {
    console.error('Error in withdrawFromAccount:', error.message);
    res.status(500).json({ message: 'Failed to withdraw funds', error: error.message });
  }
}

export async function getWalletBalance(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as any).user.userId;
    const balance = await getBalance(userId);
    res.json({ balance });
  } catch (error: any) {
    console.error('Error in getWalletBalance:', error.message);
    res.status(500).json({ message: 'Failed to get balance', error: error.message });
  }
}
