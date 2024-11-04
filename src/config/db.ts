
import knex from 'knex';
import dotenv from 'dotenv';

dotenv.config();

const db = knex({
  client: 'mysql2',
  connection: {
    /**
     * The hostname of the database server
     */
    host: process.env.DB_HOST,
    /**
     * The username to use when connecting to the database
     */
    user: process.env.DB_USER,
    /**
     * The password to use when connecting to the database
     */
    password: process.env.DB_PASSWORD,
    /**
     * The name of the database to use
     */
    database: process.env.DB_NAME,
    /**
     * The port number to use when connecting to the database
     */
    port: Number(process.env.DB_PORT),
    /**
     * Disable SSL verification
     */
    ssl: { rejectUnauthorized: false }
  },
  /**
   * The minimum and maximum number of connections in the pool
   */
  pool: { min: 0, max: 7 },
});

export default db;
