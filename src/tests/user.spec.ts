// tests/users.service.test.ts
import userService from '../services/users.service';
import db from '../config/db';
import axios from 'axios';
import bcrypt from 'bcryptjs';

jest.mock('axios');
jest.mock('bcryptjs');

// Mock DB configuration
const mockDb = {
  where: jest.fn().mockReturnThis(),
  first: jest.fn(),
  insert: jest.fn(),
};

jest.mock('../config/db', () => {
  return {
    __esModule: true,
    default: jest.fn(() => mockDb),
  };
});

describe('UserService', () => {
  const mockUser = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'password123',
    accountId: '1234567890',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');
    mockDb.where.mockReturnThis();
    mockDb.first.mockResolvedValue(null);
    mockDb.insert.mockResolvedValue([1]);
  });

  describe('register', () => {
    it('should register a user successfully', async () => {
      (axios.get as jest.Mock).mockResolvedValue({ data: { blacklisted: false } });
      mockDb.where.mockReturnValueOnce({
        first: jest.fn().mockResolvedValue(null),
      });

      const user = await userService.register(mockUser);
      expect(user).toEqual(expect.objectContaining({ email: mockUser.email, id: 1 }));
      expect(mockDb.insert).toHaveBeenCalledWith(expect.objectContaining({
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        email: mockUser.email,
        accountId: mockUser.accountId,
        password: 'hashed_password', // Expect hashed password
      }));
    });

    it('should throw an error if user is blacklisted', async () => {
      (axios.get as jest.Mock).mockResolvedValue({ data: { blacklisted: true, message: 'User is blacklisted' } });
      await expect(userService.register(mockUser)).rejects.toThrow('User is blacklisted');
    });

    it('should throw an error if user already exists', async () => {
      (axios.get as jest.Mock).mockResolvedValue({ data: { blacklisted: false } });
      mockDb.where.mockReturnValueOnce({
        first: jest.fn().mockResolvedValue(mockUser),
      });
      await expect(userService.register(mockUser)).rejects.toThrow('User already exists');
    });
  });

  describe('login', () => {
    it('should log in successfully', async () => {
      const hashedPassword = await bcrypt.hash(mockUser.password, 10);
  
      // Mock the database response to return the mock user with a hashed password
      mockDb.where.mockReturnValueOnce({
        first: jest.fn().mockResolvedValue({ ...mockUser, password: hashedPassword }),
      });
  
      // Mock bcrypt to return true for password comparison
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
  
      // Call the login method
      const { user, token } = await userService.login(mockUser.email, mockUser.password);
  
      // Assertions
      expect(user).toEqual(expect.objectContaining({ email: mockUser.email }));
      expect(token).toBeDefined();
    });
  

    it('should throw an error if user is not found', async () => {
      mockDb.where.mockReturnValueOnce({
        first: jest.fn().mockResolvedValue(undefined),
      });
      await expect(userService.login(mockUser.email, mockUser.password)).rejects.toThrow('User not found');
    });

    it('should throw an error if password is incorrect', async () => {
      const hashedPassword = await bcrypt.hash(mockUser.password, 10);
      mockDb.where.mockReturnValueOnce({
        first: jest.fn().mockResolvedValue({ ...mockUser, password: hashedPassword }),
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(userService.login(mockUser.email, 'wrong_password')).rejects.toThrow('Incorrect password');
    });
  });
});
