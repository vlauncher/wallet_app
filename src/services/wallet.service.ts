import db from '../config/db';

export interface Wallet {
  id?: number;
  userId: number;
  balance: number;
}

// Create a wallet for a new user
export async function createWallet(userId: number): Promise<void> {
  try {
    await db('wallets').insert({
      userId,
      balance: 0, // Initial balance
    });
    console.log(`Wallet created for user ${userId}`);
  } catch (error) {
    console.error('Error creating wallet:', error);
    throw error;
  }
}

// Fund a user's wallet
export async function fundAccount(userId: number, amount: number) {
  if (!userId || amount === undefined) {
    throw new Error('Both userId and amount must be provided');
  }

  try {
    const result = await db('wallets')
      .where({ userId })
      .increment('balance', amount);

    if (result === 0) throw new Error('User wallet not found');
    
    return { message: 'Account funded successfully' };
  } catch (error) {
    console.error('Error funding account:', error);
    throw error;
  }
}

// Transfer funds from one user to another
export async function transferFunds(senderId: number, recipientAccountId: string, amount: number): Promise<void> {
  const recipient = await db('users').where({ accountId: recipientAccountId }).first();
  if (!recipient) throw new Error('Recipient not found');

  await db.transaction(async trx => {
    const senderWallet = await trx('wallets').where({ userId: senderId }).first();
    if (!senderWallet || senderWallet.balance < amount) throw new Error('Insufficient balance');

    await trx('wallets').where({ userId: senderId }).decrement('balance', amount);
    await trx('wallets').where({ userId: recipient.id }).increment('balance', amount);
  });
}

// Withdraw funds from a user's wallet
export async function withdrawFunds(userId: number, amount: number): Promise<void> {
  const wallet = await db('wallets').where({ userId }).first();
  if (!wallet || wallet.balance < amount) throw new Error('Insufficient funds');

  await db('wallets').where({ userId }).decrement('balance', amount);
}

// Retrieve wallet balance
export async function getBalance(userId: number): Promise<number> {
  const wallet = await db('wallets').where({ userId }).first();
  if (!wallet) throw new Error('Wallet not found');
  return wallet.balance;
}
