import { WalletService } from '../services/wallet.service';
import db from '../config/db';

jest.mock('../config/db'); // Mock the entire db module

const walletService = new WalletService();

describe('WalletService', () => {
  const mockUserId = 1;
  const mockRecipientId = 2;
  const mockRecipientAccountId = 'recipient123';
  const mockWallet = { userId: mockUserId, balance: 1000 };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createWallet', () => {
    it('should create a new wallet successfully', async () => {
      (db as any).mockReturnValue({
        insert: jest.fn().mockResolvedValue([1]) // Mock successful insertion
      });

      await walletService.createWallet(mockUserId);

      expect(db).toHaveBeenCalledWith('wallets');
      expect(db('wallets').insert).toHaveBeenCalledWith({ userId: mockUserId, balance: 0 });
    });
  });

  describe('fundAccount', () => {
    it('should fund a user account successfully', async () => {
      (db as any).mockReturnValue({
        where: jest.fn().mockReturnThis(),
        increment: jest.fn().mockResolvedValue(1), // Mock successful increment
      });

      const result = await walletService.fundAccount(mockUserId, 500);

      expect(result).toEqual({ message: 'Account funded successfully' });
      expect(db().where).toHaveBeenCalledWith({ userId: mockUserId });
      expect(db().increment).toHaveBeenCalledWith('balance', 500);
    });

    it('should throw an error if wallet is not found', async () => {
      (db as any).mockReturnValue({
        where: jest.fn().mockReturnThis(),
        increment: jest.fn().mockResolvedValue(0), // No wallet found
      });

      await expect(walletService.fundAccount(mockUserId, 500)).rejects.toThrow('Wallet not found');
    });
  });

  describe('transferFunds', () => {
    it('should transfer funds between wallets successfully', async () => {
      (db as any).mockReturnValue({
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue({ id: mockRecipientId }), // Recipient found
      });

      // Mock the transaction to simulate DB operations
      db.transaction = jest.fn().mockImplementation(async (callback) => {
        const trx = jest.fn().mockReturnValue({
          where: jest.fn().mockReturnThis(),
          first: jest.fn().mockResolvedValue(mockWallet), 
          decrement: jest.fn().mockResolvedValue(1),
          increment: jest.fn().mockResolvedValue(1), 
        });
        return await callback(trx); 
      });

      const result = await walletService.transferFunds(mockUserId, mockRecipientAccountId, 500);

      expect(result).toEqual({ message: 'Funds transferred successfully' });
    });

    it('should throw an error if recipient is not found', async () => {
      (db as any).mockReturnValue({
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue(null), // No recipient found
      });

      await expect(
        walletService.transferFunds(mockUserId, mockRecipientAccountId, 500)
      ).rejects.toThrow('Recipient not found');
    });

    it('should throw an error if sender has insufficient funds', async () => {
      (db as any).mockReturnValue({
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue(mockWallet), // Sender found
      });

      
      db.transaction = jest.fn().mockImplementation(async (callback) => {
        const trx = jest.fn().mockReturnValue({
          where: jest.fn().mockReturnThis(),
          first: jest.fn().mockResolvedValue({ ...mockWallet, balance: 200 }), // Sender with low balance
          decrement: jest.fn().mockResolvedValue(1),
          increment: jest.fn().mockResolvedValue(1),
        });
        return await callback(trx); 
      });

      await expect(
        walletService.transferFunds(mockUserId, mockRecipientAccountId, 500)
      ).rejects.toThrow('Insufficient balance');
    });
  });

  describe('withdrawFunds', () => {
    it('should withdraw funds successfully', async () => {
      (db as any).mockReturnValue({
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue(mockWallet), // Wallet with sufficient funds
        decrement: jest.fn().mockResolvedValueOnce(1), // Successful decrement
      });

      const result = await walletService.withdrawFunds(mockUserId, 500);

      expect(result).toEqual({ message: 'Withdrawal successful' });
      expect(db().decrement).toHaveBeenCalledWith('balance', 500);
    });

    it('should throw an error if insufficient funds', async () => {
      (db as any).mockReturnValue({
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue({ ...mockWallet, balance: 100 }), // Low balance
      });

      await expect(walletService.withdrawFunds(mockUserId, 500)).rejects.toThrow('Insufficient funds');
    });
  });

  describe('getBalance', () => {
    it('should get the wallet balance successfully', async () => {
      (db as any).mockReturnValue({
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue(mockWallet),
      });

      const balance = await walletService.getBalance(mockUserId);

      expect(balance).toBe(mockWallet.balance);
      expect(db().where).toHaveBeenCalledWith({ userId: mockUserId });
    });

    it('should throw an error if wallet not found', async () => {
      (db as any).mockReturnValue({
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue(null), // No wallet found
      });

      await expect(walletService.getBalance(mockUserId)).rejects.toThrow('Wallet not found');
    });
  });
});
