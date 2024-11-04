import db from '../config/db';

export interface Wallet {
  id?: number;
  userId: number;
  balance: number;
}

export const WalletModel = {
  // Create Wallet Table
  async createWalletTable() {
    try {
      const exists = await db.schema.hasTable('wallets');
      if (!exists) {
        await db.schema.createTable('wallets', (table) => {
          table.increments('id').primary();
          table.integer('userId').unsigned().unique().notNullable()
            .references('id').inTable('users').onDelete('CASCADE');
          table.decimal('balance', 10, 2).defaultTo(0);
        });
        console.log('Wallets table created');
      } else {
        console.log('Wallets table already exists');
      }
    } catch (error) {
      console.error('Error creating Wallets table:', error);
      throw error;
    }
  },

  // Create a new wallet for a user
  async createWallet(userId: number): Promise<void> {
    try {
      await db('wallets').insert({
        userId,
        balance: 0, // Initial balance set to 0
      });
      console.log(`Wallet created for user ${userId}`);
    } catch (error) {
      console.error('Error creating wallet:', error);
      throw error;
    }
  },

  // Fund account with a specified amount
  async fundAccount(userId: number, amount: number): Promise<{ message: string }> {
    if (!userId || amount === undefined) {
      throw new Error('Both userId and amount must be provided');
    }

    try {
      const result = await db('wallets')
        .where({ userId })
        .increment('balance', amount);

      if (result === 0) {
        throw new Error('Wallet not found');
      }

      return { message: 'Account funded successfully' };
    } catch (error) {
      console.error('Error funding account:', error.message);
      throw error;
    }
  },

  // Transfer funds from one user to another
  async transferFunds(senderId: number, recipientAccountId: string, amount: number): Promise<{ message: string }> {
    if (senderId === undefined || !recipientAccountId || amount === undefined) {
      throw new Error('Sender ID, recipient account ID, and amount must all be provided');
    }

    try {
      const recipient = await db('users').where({ accountId: recipientAccountId }).first();
      if (!recipient) {
        throw new Error('Recipient account not found');
      }

      await db.transaction(async trx => {
        const senderWallet = await trx('wallets').where({ userId: senderId }).first();
        if (!senderWallet || senderWallet.balance < amount) {
          throw new Error('Insufficient balance or sender wallet not found');
        }

        await trx('wallets').where({ userId: senderId }).decrement('balance', amount);
        await trx('wallets').where({ userId: recipient.id }).increment('balance', amount);
      });

      return { message: 'Funds transferred successfully' };
    } catch (error) {
      console.error('Error transferring funds:', error.message);
      throw error;
    }
  },

  // Withdraw funds from a user account
  async withdrawFunds(userId: number, amount: number): Promise<{ message: string }> {
    try {
      const wallet = await db('wallets').where({ userId }).first();
      if (!wallet) {
        throw new Error('Wallet not found');
      }

      if (wallet.balance < amount) {
        throw new Error('Insufficient funds');
      }

      await db('wallets').where({ userId }).decrement('balance', amount);

      return { message: 'Withdrawal successful' };
    } catch (error) {
      console.error('Error during withdrawal:', error.message);
      throw error;
    }
  },

  // Get balance for a user account
  async getBalance(userId: number): Promise<number> {
    try {
      const wallet = await db('wallets').where({ userId }).first();

      if (!wallet) {
        throw new Error('Wallet not found');
      }

      return wallet.balance;
    } catch (error) {
      console.error('Error fetching balance:', error.message);
      throw error;
    }
  }
};
