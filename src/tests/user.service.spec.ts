import bcrypt from 'bcryptjs';
import db from '../config/db';
import userService from '../services/users.service';
import axios from 'axios';

jest.mock('../config/db', () => ({
  insert: jest.fn(),
  where: jest.fn().mockReturnThis(), // Ensures chaining works
  first: jest.fn(),
  del: jest.fn(),
}));

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const user = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@example.com',
        password: 'password123',
        accountId: '1234567890',
      };

      const hashedPassword = await bcrypt.hash(user.password, 10);

      // Mock the db.insert method to return a user ID
      (db as any).insert.mockResolvedValueOnce([1]); // Simulating user ID

      // Mock the Karma API response to simulate a successful email verification
      mockedAxios.post.mockResolvedValueOnce({
        data: { blacklisted: false, message: 'Identity not found in Karma ecosystem' },
      });

      const result = await userService.register(user);

      expect(result).toEqual({ ...user, id: 1, password: hashedPassword });
      expect(db.insert).toHaveBeenCalledWith({
        ...user,
        password: hashedPassword, // Ensure the hashed password is used
      });
    });
  });
});
