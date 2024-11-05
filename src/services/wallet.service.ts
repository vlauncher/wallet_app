// src/services/WalletService.ts
import db from '../config/db';

export interface Wallet {
  id?: number;
  userId: number;
  balance: number;
}

export class WalletService {
  // Create a new wallet for a user
  async createWallet(userId: number): Promise<void> {
    try {
      await db('wallets').insert({ userId, balance: 0 });
      console.log(`Wallet created for user ${userId}`);
    } catch (error) {
      console.error('Error creating wallet:', error);
      throw error;
    }
  }

  // Fund a user's wallet
  async fundAccount(userId: number, amount: number): Promise<{ message: string }> {
    if (!userId || amount === undefined) throw new Error('Both userId and amount must be provided');

    try {
      const result = await db('wallets')
        .where({ userId })
        .increment('balance', amount);

      if (result === 0) throw new Error('Wallet not found');
      
      return { message: 'Account funded successfully' };
    } catch (error) {
      console.error('Error funding account:', error);
      throw error;
    }
  }

  // Transfer funds between users
  async transferFunds(senderId: number, recipientAccountId: string, amount: number): Promise<{ message: string }> {
    if (!senderId || !recipientAccountId || amount === undefined) throw new Error('Sender ID, recipient account ID, and amount are required');

    try {
      const recipient = await db('users').where({ accountId: recipientAccountId }).first();
      if (!recipient) throw new Error('Recipient not found');

      await db.transaction(async trx => {
        const senderWallet = await trx('wallets').where({ userId: senderId }).first();
        if (!senderWallet || senderWallet.balance < amount) throw new Error('Insufficient balance');

        await trx('wallets').where({ userId: senderId }).decrement('balance', amount);
        await trx('wallets').where({ userId: recipient.id }).increment('balance', amount);
      });

      return { message: 'Funds transferred successfully' };
    } catch (error) {
      console.error('Error transferring funds:', error);
      throw error;
    }
  }

  // Withdraw funds from a user's wallet
  async withdrawFunds(userId: number, amount: number): Promise<{ message: string }> {
    try {
      const wallet = await db('wallets').where({ userId }).first();
      if (!wallet || wallet.balance < amount) throw new Error('Insufficient funds');

      await db('wallets').where({ userId }).decrement('balance', amount);

      return { message: 'Withdrawal successful' };
    } catch (error) {
      console.error('Error during withdrawal:', error);
      throw error;
    }
  }

  // Get the balance of a user's wallet
  async getBalance(userId: number): Promise<number> {
    try {
      const wallet = await db('wallets').where({ userId }).first();
      if (!wallet) throw new Error('Wallet not found');
      
      return wallet.balance;
    } catch (error) {
      console.error('Error fetching balance:', error);
      throw error;
    }
  }
}
