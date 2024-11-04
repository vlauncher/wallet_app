import db from '../config/db';
import bcrypt from 'bcryptjs';

export interface User {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  accountId: string;
}

// Create Users Table
export async function createUsersTable(): Promise<void> {
  try {
    const exists = await db.schema.hasTable('users');
    if (!exists) {
      await db.schema.createTable('users', (table) => {
        table.increments('id').primary();
        table.string('firstName').notNullable();
        table.string('lastName').notNullable();
        table.string('email').unique().notNullable();
        table.string('password').notNullable();
        table.string('accountId').unique().notNullable();
      });
      console.log('Users table created');
    } else {
      console.log('Users table already exists');
    }
  } catch (error) {
    console.error('Error creating Users table:', error);
  }
}

// Add user
export async function addUser(user: User): Promise<number> {
  try {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const [userId] = await db('users').insert({ ...user, password: hashedPassword });
    return userId;
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
}

// Find user by email
export async function findUserByEmail(email: string): Promise<User | undefined> {
  return db<User>('users').where({ email }).first();
}



// Delete all user in users tables
export async function deleteAllUsers(): Promise<void> {
  try {
    await db('users').del();
    console.log('All users deleted');
  } catch (error) {
    console.error('Error deleting all users:', error);
  }
}