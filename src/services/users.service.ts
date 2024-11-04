import bcrypt from 'bcryptjs';
import db from '../config/db';
import { User } from '../models/users.models';
import { generateAccessToken } from '../utils/tokens';
import axios from 'axios';

const KARMA_API_URL = process.env.KARMA_API_URL as string;
const KARMA_API_KEY = process.env.KARMA_API_KEY as string;


class UserService {

    // Method to verify email with Karma API for blacklisted users
    static async verifyWithKarma(email: string): Promise<{ blacklisted: boolean; message: string }> {
        const karmaApiUrl = `${KARMA_API_URL}/${email}`;
        
        try {
          const response = await axios.get(karmaApiUrl, {
            headers: { Authorization: `Bearer ${KARMA_API_KEY}` },
          });
          return response.data;
        } catch (error: any) {
          console.error("Karma API Request Error:", error.message);
      
          if (axios.isAxiosError(error)) {
            if (error.response) {
              console.error('Response data:', error.response.data);
              console.error('Status code:', error.response.status);
              console.error('Headers:', error.response.headers);
            } else if (error.request) {
              console.error('Request made but no response received:', error.request);
            } else {
              console.error('Error setting up request:', error.message);
            }
          }
      
          if (axios.isAxiosError(error) && error.response?.status === 404) {
            console.log("Identity not found in Karma ecosystem, allowing registration");
            return { blacklisted: false, message: "Identity not found in Karma ecosystem" };
          } else {
            throw new Error("Failed to verify email with Karma API");
          }
        }
      }
      

  // Register a new user
  async register(user: User): Promise<User> {
    // Check if user is blacklisted via Karma API
    const karmaCheck = await UserService.verifyWithKarma(user.email);
    if (karmaCheck.blacklisted) {
      throw new Error(karmaCheck.message || 'User is blacklisted');
    }

    // check if user already exists
    const existingUser = await db<User>('users').where({ email: user.email }).first();
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Generate a unique accountId if not provided
    const accountId = user.accountId || Math.random().toString().slice(2, 13);

    // Hash the password
    const hashedPassword = await bcrypt.hash(user.password, 10);

    // Insert user data into the database
    const [userId] = await db('users').insert({
      ...user,
      accountId,
      password: hashedPassword,
    });

    // Return the created user with the user ID
    return { ...user, id: userId };
  }


  // Login user by verifying email and password
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    try {
      // Fetch user by email
      const user = await db<User>('users').where({ email }).first();
      if (!user) {
        throw new Error('User not found');
      }

      // Compare provided password with stored hash
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error('Incorrect password');
      }

      // Generate JWT token
      const token = generateAccessToken(user.id as number);

      return { user, token };
    } catch (error) {
      console.error('Error in login:', error);
      throw error;
    }
  }

//   Delete all users
async deleteAllUsers(): Promise<void> {
  try {
    await db('users').del();
    console.log('All users deleted');
  } catch (error) {
    console.error('Error deleting all users:', error);
  }
}
}

export default new UserService();
