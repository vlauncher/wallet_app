"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var knex_1 = __importDefault(require("knex"));
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var db = (0, knex_1.default)({
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
exports.default = db;
