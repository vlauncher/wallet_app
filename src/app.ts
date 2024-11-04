import express, { Application } from 'express';
import { config } from 'dotenv';

config();

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

export default app;