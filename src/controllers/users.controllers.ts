import { Request, Response } from 'express';
import userService from '../services/users.service';
import db from '../config/db';
import { deleteAllUsers } from '../models/users.models';

class UserController {
  // Register a new user
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { firstName, lastName, email, password } = req.body;

      // Validate required fields
      if (!firstName || !lastName || !email || !password) {
        res.status(400).json({ message: 'All fields are required' });
        return;
      }

      // Call service to register user
      const accountId = Math.random().toString().slice(2, 13);
      const user = await userService.register({ firstName, lastName, email, password, accountId });
    // Check if wallet already exists
    const existingWallet = await db('wallets').where({ userId: user.id }).first();
    if (!existingWallet) {
      // Only create a wallet if it does not already exist
      await db('wallets').insert({ userId: user.id, balance: 0 });
      console.log(`Wallet created for user ${user.id}`);
    } else {
      console.log(`Wallet already exists for user ${user.id}`);
    }

      res.status(201).json({ message: 'User registered successfully',karma: 'email not blacklisted', user });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Log in an existing user
  // Log in an existing user
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      // Validate request data
      if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required' });
        return;
      }

      // Call service to authenticate user and get token
      const { user, token } = await userService.login(email, password);
      res.status(200).json({ message: 'Login successful', user, token });
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  }
  async deleteAllUsers(req: Request, res: Response): Promise<void> {
    try {
      await deleteAllUsers();
      res.status(200).json({ message: 'All users deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete all users' });
    }
  }
}

export default new UserController();
